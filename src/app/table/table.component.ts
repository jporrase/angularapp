import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

interface SchemaData {
  consumoDeAgua?: {
    fechaRiego: string;
    hora: string;
    cantidadAguaUtilizada: number;
    aguaParaPlaguicidas: string;
  };
  fertilizantes?: {
    fechaAplicacion: string;
    hora: string;
    productoAplicado: string;
    dosisMochila: number;
    cantidadTotalAplicada: number;
    frecuenciaAplicacion: string;
    foto: string | null;
  };
  cosecha?: {
    fecha: string;
    sector: string;
    cantidadFruto: string;
    frutoRechazado: string;
    pesoPromedio: string;
    loteCosecha: string;
    foto: string | null;
  };
  tratamiento?: {
    fecha: string;
    volumen: string;
    producto: string;
    cantidad: number;
    foto: string | null;
  };
  higiene?: {
    fecha: string;
    areaHigienizada: string;
    productosUtilizados: string;
    foto: string | null;
  };
  visita?: {
    fechaVisita: string;
    horaLlegada: string;
    horaSalida: string;
    nombreVisitante: string;
    numeroDpi: string;
    cantPersonasVehiculo: number;
    tipoAutomovil: string;
    placasVehiculo: string;
  };
  comite?: string;
  fitosanitarios?: {
    fechaAplicacion: string;
    hora: string;
    enfermedadControl: string;
    severidad: string;
    productoAplicado: string;
    dosisMochila: number;
    dosisTonel: number;
    cantidadAplicada: number;
    frecuenciaAplicacion: number;
    fotoAreaDanada: string;
  };
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  schemaData: SchemaData | null = null;
  private apiUrl = 'https://shark-app-2-ogevj.ondigitalocean.app/api';

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.email) {
      this.loadSchemaData(currentUser.email);
    }
  }

  loadSchemaData(email: string) {
    this.http.get<SchemaData>(`${this.apiUrl}/users/${email}/schema`)
      .subscribe({
        next: (data) => {
          this.schemaData = data;
          console.log('Loaded schema data:', data);
        },
        error: (error) => {
          console.error('Error loading schema data:', error);
          alert('Error cargando los datos');
        }
      });
  }
  async exportToNewExcel() {
    if (!this.schemaData) {
      alert('No hay datos para exportar');
      return;
    }
  
    try {
      const wb = XLSX.utils.book_new();
      const data = this.convertSchemaToExcelData(this.schemaData);
      const ws = XLSX.utils.aoa_to_sheet(data);
  
      // Add some styling to the header row
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const address = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[address]) continue;
        ws[address].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "CCCCCC" } }
        };
      }
  
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte Agricultura');
      
      // Save the file
      const fileName = `reporte-agricultura-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Error creating Excel file:', error);
      alert('Error creando el archivo Excel');
    }
  }

  private convertSchemaToExcelData(schema: SchemaData): any[] {
    const currentUser = this.authService.getCurrentUser();
    const currentDateTime = new Date().toLocaleString();
    
    // First row - headers
    const headers = [
      'Fecha y Hora', 'Email', 'Teléfono', 'Finca', 'Dueño', 'Comité',
      // Consumo de Agua
      'Agua-Fecha Riego', 'Agua-Hora', 'Agua-Cantidad Utilizada', 'Agua-Para Plaguicidas',
      // Fertilizantes
      'Fert-Fecha', 'Fert-Hora', 'Fert-Producto', 'Fert-Dosis Mochila', 'Fert-Cantidad Total', 'Fert-Frecuencia',
      // Cosecha
      'Cos-Fecha', 'Cos-Sector', 'Cos-Cantidad Fruto', 'Cos-Fruto Rechazado', 'Cos-Peso Promedio', 'Cos-Lote',
      // Tratamiento
      'Trat-Fecha', 'Trat-Volumen', 'Trat-Producto', 'Trat-Cantidad',
      // Higiene
      'Hig-Fecha', 'Hig-Area', 'Hig-Productos',
      // Visitas
      'Vis-Fecha', 'Vis-Hora Llegada', 'Vis-Hora Salida', 'Vis-Nombre', 'Vis-DPI', 'Vis-Personas', 'Vis-Tipo Auto', 'Vis-Placas',
      // Fitosanitarios
      'Fito-Fecha', 'Fito-Hora', 'Fito-Enfermedad', 'Fito-Severidad', 'Fito-Producto', 'Fito-Dosis Mochila', 
      'Fito-Dosis Tonel', 'Fito-Cantidad', 'Fito-Frecuencia'
    ];
  
    // Data row
    const dataRow = [
      currentDateTime,
      currentUser?.email || 'N/A',
      currentUser?.phone || 'N/A',
      currentUser?.finca || 'N/A',
      currentUser?.owner || 'N/A',
      schema.comite || 'N/A',
      
      // Consumo de Agua
      schema.consumoDeAgua?.fechaRiego || '',
      schema.consumoDeAgua?.hora || '',
      schema.consumoDeAgua?.cantidadAguaUtilizada || '',
      schema.consumoDeAgua?.aguaParaPlaguicidas || '',
      
      // Fertilizantes
      schema.fertilizantes?.fechaAplicacion || '',
      schema.fertilizantes?.hora || '',
      schema.fertilizantes?.productoAplicado || '',
      schema.fertilizantes?.dosisMochila || '',
      schema.fertilizantes?.cantidadTotalAplicada || '',
      schema.fertilizantes?.frecuenciaAplicacion || '',
      
      // Cosecha
      schema.cosecha?.fecha || '',
      schema.cosecha?.sector || '',
      schema.cosecha?.cantidadFruto || '',
      schema.cosecha?.frutoRechazado || '',
      schema.cosecha?.pesoPromedio || '',
      schema.cosecha?.loteCosecha || '',
      
      // Tratamiento
      schema.tratamiento?.fecha || '',
      schema.tratamiento?.volumen || '',
      schema.tratamiento?.producto || '',
      schema.tratamiento?.cantidad || '',
      
      // Higiene
      schema.higiene?.fecha || '',
      schema.higiene?.areaHigienizada || '',
      schema.higiene?.productosUtilizados || '',
      
      // Visitas
      schema.visita?.fechaVisita || '',
      schema.visita?.horaLlegada || '',
      schema.visita?.horaSalida || '',
      schema.visita?.nombreVisitante || '',
      schema.visita?.numeroDpi || '',
      schema.visita?.cantPersonasVehiculo || '',
      schema.visita?.tipoAutomovil || '',
      schema.visita?.placasVehiculo || '',
      
      // Fitosanitarios
      schema.fitosanitarios?.fechaAplicacion || '',
      schema.fitosanitarios?.hora || '',
      schema.fitosanitarios?.enfermedadControl || '',
      schema.fitosanitarios?.severidad || '',
      schema.fitosanitarios?.productoAplicado || '',
      schema.fitosanitarios?.dosisMochila || '',
      schema.fitosanitarios?.dosisTonel || '',
      schema.fitosanitarios?.cantidadAplicada || '',
      schema.fitosanitarios?.frecuenciaAplicacion || ''
    ];
  
    return [headers, dataRow];
  }
  
  // Modify the appendToExistingExcel method
  async appendToExistingExcel() {
    if (!this.schemaData) {
      alert('No hay datos para exportar');
      return;
    }
  
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.xlsx,.xls';
  
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
  
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const wb = XLSX.read(data, { type: 'array' });
            const wsName = wb.SheetNames[0];
            const ws = wb.Sheets[wsName];
  
            // Get existing data
            const existingData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
            
            // Get new data (only the data row, not headers)
            const newData = this.convertSchemaToExcelData(this.schemaData!);
            
            // If this is the first row, add headers
            if (existingData.length === 0) {
              existingData.push(newData[0]);
            }
            
            // Add the new data row
            existingData.push(newData[1]);
  
            // Create new worksheet with combined data
            const newWs = XLSX.utils.aoa_to_sheet(existingData);
            wb.Sheets[wsName] = newWs;
  
            // Save the updated file
            const fileName = `${file.name.split('.')[0]}_actualizado.xlsx`;
            XLSX.writeFile(wb, fileName);
          } catch (error) {
            console.error('Error processing Excel file:', error);
            alert('Error procesando el archivo Excel');
          }
        };
  
        reader.readAsArrayBuffer(file);
      };
  
      input.click();
    } catch (error) {
      console.error('Error with Excel operation:', error);
      alert('Error con la operación de Excel');
    }
  }

  async exportToPDF() {
    const element = document.querySelector('.container');
    if (!element) return;

    try {
      const pdf = new jsPDF();
      const currentUser = this.authService.getCurrentUser();
      
      // Add title and user info
      pdf.setFontSize(16);
      pdf.text(`Reporte de Agricultura - ${currentUser?.email || 'N/A'}\ntelefono:${currentUser?.phone || 'N/A'} \nfinca:${currentUser?.finca || 'N/A'}\ndueño:${currentUser?.owner || 'N/A'}\n\n`, 40, 40);
      
      pdf.setFontSize(12);
      pdf.text(`\n\nFecha de reporte: ${new Date().toLocaleDateString()}`, 40, 60);

      // Convert all tables to PDF format
      const tables = element.querySelectorAll('table');
      let yOffset = 80;

      for (let table of Array.from(tables)) {
        const sectionTitle = table.previousElementSibling?.textContent || '';
        
        pdf.setFontSize(14);
        if (yOffset > 750) {
          pdf.addPage();
          yOffset = 40;
        }
        pdf.text(sectionTitle, 40, yOffset);
        yOffset += 20;

        await autoTable(pdf, {
          html: table,
          startY: yOffset,
          styles: { fontSize: 8 },
          margin: { top: 40, right: 40, bottom: 40, left: 40 },
        });

        yOffset = (pdf as any).lastAutoTable.finalY + 30;
      }

      // Add page numbers
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.text(
          `Página ${i} de ${pageCount}`,
          pdf.internal.pageSize.width - 100,
          pdf.internal.pageSize.height - 20
        );
      }

      // Save the PDF
      pdf.save(`reporte-agricultura-${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generando el PDF');
    }
  }

  goBack() {
    this.router.navigate(['/comite']);
  }
}
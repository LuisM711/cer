import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppService } from '../../app.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../app.environment';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-afiliado',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    HeaderComponent,
    MatIconModule
  ],
  templateUrl: './afiliado.component.html',
  styleUrl: './afiliado.component.css'
})
export class AfiliadoComponent {
  misDatos: any = {};
  documentos: { key: string, label: string, url: string, file?: File }[] = [];
  backend = environment.backendUrl;

  constructor(private appService: AppService, private dialog: MatDialog) { }

  ngOnInit() {
    this.appService.getMiAfiliacion().subscribe(
      (response: any) => {
        this.misDatos = response;

        const docKeys = ['comprobanteSucursal', 'comprobanteMatriz', 'ine', 'csf', 'logoPdf', 'logoPng'];

        this.documentos = docKeys.map(key => ({
          key,
          label: this.toLabel(key),
          url: `${this.backend}/documentos/${response.id}/${key}`
        }));
      },
      (error: any) => {
        console.error('Error fetching afiliado data:', error);
      }
    );
  }

  toLabel(key: string): string {
    const map: Record<string, string> = {
      comprobanteSucursal: 'Comprobante de sucursal',
      comprobanteMatriz: 'Comprobante de matriz',
      ine: 'INE',
      csf: 'Constancia de situación fiscal',
      logoPdf: 'Logo (PDF)',
      logoPng: 'Logo (PNG)'
    };
    return map[key] || key;
  }

  onFileChange(event: any, key: string) {
    const file = event.target.files[0];
    const doc = this.documentos.find(d => d.key === key);
    if (doc && file) {
      doc.file = file;
    }
  }

  verDocumento(doc: any) {
  this.dialog.open(DocumentoDialogComponent, {
    data: doc,
    width: '50vw',
    height: '80vh',
    maxHeight: '90vh',
    maxWidth: 'none'
  });
}


  guardarCambios() {
    console.log('Datos a guardar:', this.misDatos);
    console.log('Archivos a subir:', this.documentos.filter(d => d.file));
    // Aquí irá tu integración al backend
  }
}

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';

// ...dentro del componente:

@Component({
  selector: 'app-documento-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatCardModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title style="font-family: Roboto, sans-serif;">{{ data.label }}</h2>
    <mat-dialog-content style="text-align: center; padding: 16px; align-content: center;">
      <mat-card>
        <mat-card-content>
          <iframe [src]="safeUrl" style="width: 100%; height: 500px; border: none;" loading="lazy"></iframe>
        </mat-card-content>
      </mat-card>
    </mat-dialog-content>
    <mat-dialog-actions align="end" style="padding: 8px 24px;">
      <button mat-stroked-button color="primary" mat-dialog-close>
        Cerrar
      </button>
    </mat-dialog-actions>
  `
})
export class DocumentoDialogComponent {
  safeUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
  }
}

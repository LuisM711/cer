

import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AppService } from '../../app.service';
import { NgFor, CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged, catchError } from 'rxjs/operators';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { Workbook } from 'exceljs';
import { MatDatepickerModule } from '@angular/material/datepicker';


@Component({
  selector: 'app-comercios',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule, NgFor, MatButtonModule, FormsModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './comercios.component.html',
  styleUrl: './comercios.component.css'
})
export class ComerciosComponent {
  searchTextChanged = new Subject<string>();
  noResults = false;

  environment = environment;
  comercios: any[] = [];
  searchText: string = "";

  isAdmin = false;
  isOperador = false;
  isReadonly = true;

  constructor(private appService: AppService, private dialog: MatDialog) {

    this.appService.verifyAdmin().subscribe({
      next: (response: any) => {
        this.isAdmin = response.role === 'admin';
        this.isReadonly = !this.isAdmin;

        console.log(this.isAdmin);
      },
      error: (error: any) => {
        console.error('Error verifying admin status:', error);
      }
    });
    this.appService.verifyOperador().subscribe({
      next: (response: any) => {
        this.isOperador = response.success;
        this.isReadonly = !this.isOperador;
      },
      error: (error: any) => {
        console.error('Error verifying operador status:', error);
      }
    });
  }

  ngOnInit() {
    this.getComercios();

    this.searchTextChanged.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((text) => {
        if (!text.trim()) {
          this.noResults = false;
          this.getComercios();
          return of(null);
        }
        return this.appService.getAfiliacionPorNombreYGiro(text, "Comercio").pipe(
          catchError(() => of([]))
        );
      })
    ).subscribe((result) => {
      if (Array.isArray(result)) {
        result = result.map((r: any) => ({
          ...r,
          logoUrl: `${environment.backendUrl}/documentos/${r.id}/logoPng?cb=${Date.now()}`
        }));
      }
      if (result === null) return;
      this.comercios = result;
      this.noResults = result.length === 0;
    });

  }
  onSearchChange(value: string) {
    this.searchTextChanged.next(value);
  }


  getComercios() {
    this.appService.getAfiliacionByGiro('Comercio').subscribe(resp => {
      this.comercios = resp.map((r: { id: any; }) => ({
        ...r,
        logoUrl: `${environment.backendUrl}/documentos/${r.id}/logoPng?cb=${Date.now()}`
      }));
    });
  }

  viewComercio(id: any) {
    const comercio = this.comercios.find(c => c.id === id);
    if (comercio) {
      console.log(comercio);
      this.dialog.open(ComercioDialogComponent, {
        data: {
          ...comercio,
          isAdmin: this.isAdmin
        },
        width: '500px',
        maxHeight: '90vh',
      }).afterClosed().subscribe(result => {
        console.log(result);
        this.getComercios();
      });
    }
  }
  viewPolizaDerechos(id: any): void {
    const comercio = this.comercios.find(c => c.id === id);
    if (!comercio) {
      return;
    }

    const printContents = `
      <html>
        <head>
          <title>Póliza de derechos</title>
          <style>
            @page { margin: 2cm 1cm; }
            body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            .content {
              display: flex;
              flex-direction: column;
              margin-top: 250px;
              line-height:1.4;
            }
              p {
                margin: 0;
                font-size: 18px;
              }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="content">
            <p><strong>NUMERO DE PÓLIZA:</strong> ${comercio.poliza}</p>
            <p><strong>NUMERO UBICACIÓN PÓLIZA:</strong> ${comercio.polizaUbicacion}</p>
            <p><strong>NUMERO CONTROL CER:</strong> ${comercio.id}</p>
            <p><strong>RAZÓN SOCIAL DEL Comercio ASEGURADO:</strong><br>${comercio.razonSocial}</p>
            <p><strong>NOMBRE COMERCIAL:</strong> ${comercio.nombreComercial}</p>
            <p><strong>DIRECCIÓN DE LA UBICACIÓN (SUCURSAL) ASEGURADA:</strong><br>${comercio.domicilioSucursal}</p>
            <p><strong>C.P.:</strong> ${comercio.codigoPostal}</p>
            <p>
              <strong>NUMERO FACTURA AFILIACIÓN:</strong> ${comercio.numeroFactura}
              &nbsp;&nbsp;<strong>FECHA DE FACTURA:</strong>
              ${new Date(comercio.fechaAfiliacion).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContents);
      printWindow.document.close();
    }
  }
  async reporteGeneral() {

    const wb = new Workbook();
    const ws = wb.addWorksheet('Comercios');



    ws.columns = [
      { header: 'ID', key: 'id', width: 10 },

      { header: 'Razón social', key: 'razonSocial', width: 30 },
      { header: 'Nombre comercial', key: 'nombreComercial', width: 30 },
      { header: 'Giro', key: 'giro', width: 20 },
      { header: 'Subgiro', key: 'subgiro', width: 20 },
      { header: 'Página Web', key: 'paginaWeb', width: 30 },
      { header: 'Facebook', key: 'facebook', width: 30 },
      { header: 'Instagram', key: 'instagram', width: 30 },
      { header: 'Google Maps', key: 'googleMaps', width: 30 },

      { header: 'Nombre del propietario', key: 'nombrePropietario', width: 30 },
      { header: 'Teléfono del propietario', key: 'telefonoPropietario', width: 20 },
      { header: 'Email del propietario', key: 'emailPropietario', width: 30 },
      { header: 'Fecha de nacimiento del propietario', key: 'fechaNacimientoPropietario', width: 20 },

      { header: 'Nombre del gerente', key: 'nombreGerente', width: 30 },
      { header: 'Teléfono del gerente', key: 'telefonoGerente', width: 20 },
      { header: 'Email del gerente', key: 'emailGerente', width: 30 },
      { header: 'Fecha de nacimiento del gerente', key: 'fechaNacimientoGerente', width: 20 },

      { header: 'Domicilio fiscal', key: 'domicilioFiscal', width: 40 },
      { header: 'Domicilio de sucursal', key: 'domicilioSucursal', width: 40 },
      { header: 'Código postal', key: 'codigoPostal', width: 15 },
      { header: 'RFC', key: 'rfc', width: 20 },
      { header: 'Teléfono Oficina', key: 'telefonoOficina', width: 20 },
      { header: 'Fecha de alta', key: 'fechaAlta', width: 20 },
      { header: 'Fecha de afiliación', key: 'fechaAfiliacion', width: 20 },
      { header: 'Fecha de vencimiento', key: 'fechaVencimiento', width: 20 },
      { header: 'Póliza', key: 'poliza', width: 20 },
      { header: 'Ubicación póliza', key: 'polizaUbicacion', width: 15 },
      { header: 'Número de factura', key: 'numeroFactura', width: 15 },
      { header: 'Importe de factura', key: 'importeFactura', width: 15 },

      { header: 'Activo', key: 'isActive', width: 10 },
      // { header: 'URL Logo', key: 'logoUrl', width: 40 }
    ];


    this.comercios.forEach(r => {
      ws.addRow({
        ...r,

        fechaNacimientoPropietario: this.formatDate(r.fechaNacimientoPropietario),
        fechaNacimientoGerente: this.formatDate(r.fechaNacimientoGerente),
        fechaAlta: this.formatDate(r.createdAt),
        fechaAfiliacion: this.formatDate(r.fechaAfiliacion),
        fechaVencimiento: this.formatDate(r.fechaVencimiento),
        createdAt: this.formatDateTime(r.createdAt),
        updatedAt: this.formatDateTime(r.updatedAt),
        isActive: r.isActive ? 'Sí' : 'No'
      });
    });


    ws.getRow(1).font = { bold: true };


    const buf = await wb.xlsx.writeBuffer();
    const blob = new Blob([buf], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_Comercios_${new Date().toISOString().slice(0, 10)}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  private formatDate(d: any): string {
    return d
      ? new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : '';
  }

  private formatDateTime(d: any): string {
    return d
      ? new Date(d).toLocaleString('es-MX', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
      : '';
  }
}












interface Giro { name: string; subgiros: { name: string }[] }
interface Documento {
  key: string; label: string; url: string; inline: boolean; file?: File;
}
@Component({
  selector: 'app-comercios-dialog',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,

  ],
  template: `
    <form [formGroup]="form" class="dialog-form" (ngSubmit)="onSubmit()">
  <mat-dialog-content class="dialog-content">

    <!-- DATOS GENERALES -->
    <section>
      <h3>Datos generales</h3>
      <div class="row">
        <mat-form-field appearance="fill">
          <mat-label>Razón social</mat-label>
          <input matInput formControlName="razonSocial" [disabled]="!isAdmin">
          <mat-error *ngIf="f['razonSocial'].invalid && f['razonSocial'].touched">
            Razón social es obligatoria
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Nombre comercial</mat-label>
          <input matInput formControlName="nombreComercial" [disabled]="!isAdmin">
          <mat-error *ngIf="f['nombreComercial'].invalid && f['nombreComercial'].touched">
            Nombre comercial es obligatorio
          </mat-error>
        </mat-form-field>
      </div>
      <div class="row">
        <!-- GIRO -->
          <mat-form-field appearance="fill">
          <mat-label>Giro</mat-label>
          <mat-select formControlName="giro" (selectionChange)="onGiroChange($event.value)" [disabled]="!isAdmin">
            <mat-option *ngFor="let g of giros" [value]="g">{{ g.name }}</mat-option>
          </mat-select>
          <mat-error *ngIf="f['giro'].invalid && f['giro'].touched">Giro es obligatorio</mat-error>
        </mat-form-field>

        <!-- SUBGIRO -->
        <mat-form-field appearance="fill">
          <mat-label>Subgiro</mat-label>
          <mat-select formControlName="subgiro" [disabled]="!isAdmin || !subgiros.length">
            <mat-option *ngFor="let s of subgiros" [value]="s">{{ s.name }}</mat-option>
          </mat-select>
          <mat-error *ngIf="f['subgiro'].invalid && f['subgiro'].touched">Subgiro es obligatorio</mat-error>
        </mat-form-field>
      </div>
      <div class="row">
        <mat-form-field appearance="fill">
          <mat-label>Página Web</mat-label>
          <input matInput formControlName="paginaWeb" [disabled]="!isAdmin">
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Facebook</mat-label>
          <input matInput formControlName="facebook" [disabled]="!isAdmin">
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Instagram</mat-label>
          <input matInput formControlName="instagram" [disabled]="!isAdmin">
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Google Maps</mat-label>
          <input matInput formControlName="googleMaps" [disabled]="!isAdmin">
        </mat-form-field>
      </div>
    </section>

    <mat-divider></mat-divider>

    <!-- DATOS DEL PROPIETARIO -->
    <section>
      <h3>Datos del propietario</h3>
      <a [href]="'https://wa.me/' + f['telefonoPropietario'].value" target="_blank" mat-raised-button color="primary" style="margin-bottom: 18px;">
        <img src="/assets/logos/whatsapp.png" alt="" style="width: 20px; height: 20px;vertical-align: middle;">
        Enviar mensaje por WhatsApp
      </a>
      <div class="row">
        <mat-form-field appearance="fill">
          <mat-label>Nombre del propietario</mat-label>
          <input matInput formControlName="nombrePropietario" [disabled]="!isAdmin">
          <mat-error *ngIf="f['nombrePropietario'].invalid && f['nombrePropietario'].touched">
            Nombre del propietario es obligatorio
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Teléfono del propietario</mat-label>
          <input matInput formControlName="telefonoPropietario" [disabled]="!isAdmin">
          <mat-error *ngIf="f['telefonoPropietario'].invalid && f['telefonoPropietario'].touched">
            Teléfono del propietario es obligatorio
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Email del propietario</mat-label>
          <input matInput formControlName="emailPropietario" [disabled]="!isAdmin">
          <mat-error *ngIf="f['emailPropietario'].invalid && f['emailPropietario'].touched">
            Email del propietario inválido
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Fecha de nacimiento del propietario</mat-label>
          <input matInput [matDatepicker]="pickerFechaNacimientoPropietario" formControlName="fechaNacimientoPropietario" [disabled]="!isAdmin">
          <mat-datepicker-toggle matSuffix [for]="pickerFechaNacimientoPropietario"></mat-datepicker-toggle>
          <mat-datepicker  icker #pickerFechaNacimientoPropietario></mat-datepicker>
          <mat-error *ngIf="f['fechaNacimientoPropietario'].invalid && f['fechaNacimientoPropietario'].touched">
            Fecha de nacimiento del propietario es obligatoria
          </mat-error>
        </mat-form-field>
      </div>
    </section>

    <mat-divider></mat-divider>

    <!-- DATOS DEL GERENTE -->
    <section>
      <h3>Datos del gerente</h3>
      <a [href]="'https://wa.me/' + f['telefonoGerente'].value" target="_blank" mat-raised-button color="primary" style="margin-bottom: 18px;">
        <img src="/assets/logos/whatsapp.png" alt="" style="width: 20px; height: 20px;vertical-align: middle;">
        Enviar mensaje por WhatsApp
      </a>
      <div class="row">
        <mat-form-field appearance="fill">
          <mat-label>Nombre del gerente</mat-label>
          <input matInput formControlName="nombreGerente" [disabled]="!isAdmin">
          <mat-error *ngIf="f['nombreGerente'].invalid && f['nombreGerente'].touched">
            Nombre del gerente es obligatorio
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Teléfono del gerente</mat-label>
          <input matInput formControlName="telefonoGerente" [disabled]="!isAdmin">
          <mat-error *ngIf="f['telefonoGerente'].invalid && f['telefonoGerente'].touched">
            Teléfono del gerente es obligatorio
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Email del gerente</mat-label>
          <input matInput formControlName="emailGerente" [disabled]="!isAdmin">
          <mat-error *ngIf="f['emailGerente'].invalid && f['emailGerente'].touched">
            Email del gerente inválido
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Fecha de nacimiento del gerente</mat-label>
          <input matInput [matDatepicker]="pickerFechaNacimientoGerente" formControlName="fechaNacimientoGerente" [disabled]="!isAdmin">
          <mat-datepicker-toggle matSuffix [for]="pickerFechaNacimientoGerente"></mat-datepicker-toggle>
          <mat-datepicker  icker #pickerFechaNacimientoGerente></mat-datepicker>
          <mat-error *ngIf="f['fechaNacimientoGerente'].invalid && f['fechaNacimientoGerente'].touched">
            Fecha de nacimiento del gerente es obligatoria
          </mat-error>
        </mat-form-field>
      </div>
    </section>

    <mat-divider></mat-divider>

    <!-- FACTURACIÓN Y PÓLIZA -->
    <section>
      <h3>Facturación y póliza</h3>
      <div class="row">
        <mat-form-field appearance="fill">
          <mat-label>Domicilio fiscal</mat-label>
          <input matInput formControlName="domicilioFiscal" [disabled]="!isAdmin">
          <mat-error *ngIf="f['domicilioFiscal'].invalid && f['domicilioFiscal'].touched">
            Domicilio fiscal es obligatorio
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Domicilio de sucursal</mat-label>
          <input matInput formControlName="domicilioSucursal" [disabled]="!isAdmin">
          <mat-error *ngIf="f['domicilioSucursal'].invalid && f['domicilioSucursal'].touched">
            Domicilio de sucursal es obligatorio
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Código postal</mat-label>
          <input matInput formControlName="codigoPostal" [disabled]="!isAdmin">
          <mat-error *ngIf="f['codigoPostal'].invalid && f['codigoPostal'].touched">
            Código postal es obligatorio
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>RFC</mat-label>
          <input matInput formControlName="rfc" [disabled]="!isAdmin">
          <mat-error *ngIf="f['rfc'].invalid && f['rfc'].touched">
            RFC inválido
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Teléfono Oficina</mat-label>
          <input matInput formControlName="telefonoOficina" [disabled]="!isAdmin">
          <mat-error *ngIf="f['telefonoOficina'].invalid && f['telefonoOficina'].touched">
            Teléfono de oficina es obligatorio
          </mat-error>
        </mat-form-field>
      </div>
      <div class="row">
        <mat-form-field appearance="fill">
          <mat-label>Fecha de alta</mat-label>
          <input matInput [matDatepicker]="pickerFechaAlta" formControlName="fechaAlta" [disabled]="true">
          <mat-datepicker-toggle matSuffix [for]="pickerFechaAlta"></mat-datepicker-toggle>
          <mat-datepicker  picker #pickerFechaAlta></mat-datepicker>
          <mat-error *ngIf="f['fechaAlta'].invalid && f['fechaAlta'].touched">
            Fecha de alta es obligatoria
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Fecha de afiliación</mat-label>

          <input matInput [matDatepicker]="pickerFechaAfiliacion" formControlName="fechaAfiliacion" [disabled]="!isAdmin">
          <mat-datepicker-toggle matSuffix [for]="pickerFechaAfiliacion"></mat-datepicker-toggle>
          <mat-datepicker #pickerFechaAfiliacion></mat-datepicker>
          <mat-error *ngIf="f['fechaAfiliacion'].invalid && f['fechaAfiliacion'].touched">
            Fecha de afiliación es obligatoria
          </mat-error>
        </mat-form-field>



        <mat-form-field appearance="fill">
          <mat-label>Fecha de vencimiento</mat-label>
          <input matInput [matDatepicker]="pickerFechaVencimiento" formControlName="fechaVencimiento" [disabled]="!isAdmin">
          <mat-datepicker-toggle matSuffix [for]="pickerFechaVencimiento"></mat-datepicker-toggle>
          <mat-datepicker #pickerFechaVencimiento></mat-datepicker>
          <mat-error *ngIf="f['fechaVencimiento'].invalid && f['fechaVencimiento'].touched">
            Fecha de vencimiento es obligatoria
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Póliza</mat-label>
          <input matInput formControlName="poliza" [disabled]="!isAdmin">
          <mat-error *ngIf="f['poliza'].invalid && f['poliza'].touched">
            Póliza es obligatoria
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Ubicación póliza</mat-label>
          <input matInput formControlName="polizaUbicacion" [disabled]="!isAdmin">
          <mat-error *ngIf="f['polizaUbicacion'].invalid && f['polizaUbicacion'].touched">
            Ubicación póliza es obligatoria
          </mat-error>
        </mat-form-field>
      </div>
      <div class="row">
        <mat-form-field appearance="fill">
          <mat-label>Número de factura</mat-label>
          <input matInput type="number" formControlName="numeroFactura" [disabled]="!isAdmin">
          <mat-error *ngIf="f['numeroFactura'].invalid && f['numeroFactura'].touched">
            Número de factura es obligatorio
          </mat-error>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Importe de factura</mat-label>
          <input matInput type="number" formControlName="importeFactura" [disabled]="!isAdmin">
          <mat-error *ngIf="f['importeFactura'].invalid && f['importeFactura'].touched">
            Importe de factura es obligatorio
          </mat-error>
        </mat-form-field>
      </div>
    </section>

    <mat-divider></mat-divider>

    <!-- DOCUMENTOS -->
    <section *ngIf="documentos.length">
      <h3>Documentos</h3>
      <mat-card *ngFor="let doc of documentos" class="doc-item">
        <mat-card-title>{{ doc.label }}</mat-card-title>
        <mat-card-content class="doc-content">
          <button type="button" mat-button color="accent" (click)="verDocumento(doc)">
            <mat-icon>visibility</mat-icon> Ver
          </button>
          <input
            type="file"
            #fileInput
            hidden
            (change)="onFileSelected($event, doc.key)"
            [attr.accept]="acceptTypesFor(doc.key)"
          />
          <button
            mat-stroked-button
            color="primary"
            type="button"
            [disabled]="!isAdmin"
            (click)="fileInput.click()"
          >
            <mat-icon>upload</mat-icon>
            {{ doc.file ? 'Cambiar archivo' : 'Subir archivo' }}
          </button>
          <p *ngIf="doc.file" class="archivo-nombre">
            Archivo: {{ doc.file.name }}
          </p>
        </mat-card-content>
      </mat-card>
    </section>

  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button type="button" mat-button (click)="dialogRef.close()">Cerrar</button>
    <button
      mat-button
      color="primary"
      type="submit"
      [disabled]="form.invalid || !isAdmin"
    >
      Guardar
    </button>
  </mat-dialog-actions>
</form>


  `,
  styles: [`
    .dialog-content { display: flex; flex-direction: column; gap: 1rem; text-align: center; }
    .section { margin-top: 1rem; }
    .row { display: flex; flex-wrap: wrap; gap: 1rem;justify-content: center }
    .row mat-form-field {flex: 1 1 200px;width: 280px;               
}
    .docs-section { margin-top: 1.5rem; }
    .doc-item { margin-bottom: .75rem; }
    .doc-img { max-width: 100%; max-height: 200px; border: 1px solid #ccc; border-radius: 4px; }
    
  `]
})




export class ComercioDialogComponent implements OnInit {
  form!: FormGroup;
  giros: Giro[] = [];
  subgiros: { name: string }[] = [];
  documentos: Documento[] = [];
  isAdmin: boolean;





  onGiroChange(selectedGiro: any): void {
    this.subgiros = selectedGiro ? selectedGiro.subgiros : [];
    this.form.get('subgiro')?.reset();
  }

  private fileConstraints: Record<string, { maxSize: number; types: string[] }> = {
    logoPng: { maxSize: 2 << 20, types: ['image/png'] },
    logoPdf: { maxSize: 2 << 20, types: ['application/pdf'] },
    default: { maxSize: 2 << 20, types: ['image/*', 'application/pdf'] }
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ComercioDialogComponent>,
    private appService: AppService,
    private dialog: MatDialog
  ) {
    this.isAdmin = data.isAdmin;
    console.log(this.isAdmin);
    this.loadGiros();
  }



  private loadGiros() {
    this.appService.getGiros().subscribe({
      next: resp => {

        const map = new Map<string, Giro>();
        resp.forEach((item: { giro: string; subgiro: any; }) => {
          if (!map.has(item.giro)) {
            map.set(item.giro, { name: item.giro, subgiros: [] });
          }
          map.get(item.giro)!.subgiros.push({ name: item.subgiro });
        });
        this.giros = Array.from(map.values());


        const selGiro = this.giros.find(g => g.name === this.data.giro) || null;
        this.form.get('giro')!.setValue(selGiro);
        this.subgiros = selGiro ? selGiro.subgiros : [];


        const selSub = this.subgiros.find(s => s.name === this.data.subgiro) || null;
        this.form.get('subgiro')!.setValue(selSub);
      },
      error: err => {
        console.error('Error cargando giros', err);
        this.snackBar.open('No se pudieron cargar los giros', 'Cerrar', { duration: 3000 });
      }
    });
  }
  ngOnInit() {
    this.form = this.fb.group({
      razonSocial: [this.data.razonSocial, Validators.required],
      nombreComercial: [this.data.nombreComercial, Validators.required],
      giro: [null, Validators.required],
      subgiro: [null, Validators.required],
      paginaWeb: [this.data.paginaWeb],
      facebook: [this.data.facebook],
      instagram: [this.data.instagram],
      googleMaps: [this.data.googleMaps],
      nombrePropietario: [this.data.nombrePropietario, Validators.required],
      telefonoPropietario: [this.data.telefonoPropietario, Validators.required],
      emailPropietario: [this.data.emailPropietario, [Validators.required, Validators.email]],
      fechaNacimientoPropietario: [this.data.fechaNacimientoPropietario, Validators.required],
      nombreGerente: [this.data.nombreGerente, Validators.required],
      telefonoGerente: [this.data.telefonoGerente, Validators.required],
      emailGerente: [this.data.emailGerente, [Validators.required, Validators.email]],
      fechaNacimientoGerente: [this.data.fechaNacimientoGerente, Validators.required],
      domicilioFiscal: [this.data.domicilioFiscal, Validators.required],
      domicilioSucursal: [this.data.domicilioSucursal, Validators.required],
      codigoPostal: [this.data.codigoPostal, Validators.required],
      rfc: [this.data.rfc, [Validators.required]],
      telefonoOficina: [this.data.telefonoOficina, Validators.required],
      fechaAlta: [{ value: this.data.createdAt, disabled: true }, Validators.required],
      fechaAfiliacion: [this.data.fechaAfiliacion, Validators.required],
      fechaVencimiento: [this.data.fechaVencimiento, Validators.required],
      poliza: [this.data.poliza, Validators.required],
      polizaUbicacion: [this.data.polizaUbicacion, Validators.required],
      numeroFactura: [this.data.numeroFactura, Validators.required],
      importeFactura: [this.data.importeFactura, Validators.required],


      comprobanteSucursal: [null],
      comprobanteMatriz: [null],
      ine: [null],
      csf: [null],
      logoPdf: [null],
      logoPng: [null]

    });

    const backend = environment.backendUrl;
    const id = this.data.id;
    ['comprobanteSucursal', 'comprobanteMatriz', 'ine', 'csf', 'logoPdf', 'logoPng']
      .forEach(key => this.documentos.push({
        key,
        label: this.toLabel(key),
        url: `${backend}/documentos/${id}/${key}`,
        inline: key === 'logoPng'
      }));

    if (!this.isAdmin) {
      this.form.disable();
    }
  }

  get f() { return this.form.controls; }

  toLabel(key: string): string {
    return {
      comprobanteSucursal: 'Comprobante de la sucursal',
      comprobanteMatriz: 'Comprobante de la matriz',
      ine: 'INE',
      csf: 'CSF',
      logoPdf: 'Logo (PDF)',
      logoPng: 'Logo (PNG)'
    }[key] || key;
  }

  acceptTypesFor(key: string): string {
    return (this.fileConstraints[key] || this.fileConstraints['default'])
      .types.join(',');
  }

  onFileSelected(ev: Event, controlName: string) {
    const input = ev.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    const { maxSize, types } = this.fileConstraints[controlName] ?? this.fileConstraints['default'];

    if (file.size > maxSize) {
      this.snackBar.open(`"${file.name}" excede ${(maxSize / 1e6).toFixed(0)} MB.`, 'Cerrar', { duration: 3000 });
      input.value = ''; return;
    }
    const valid = types.some(t => t.endsWith('/*') ? file.type.startsWith(t.slice(0, -1)) : file.type === t);
    if (!valid) {
      this.snackBar.open(`Tipo no permitido: ${types.join(', ')}`, 'Cerrar', { duration: 3000 });
      input.value = ''; return;
    }
    const doc = this.documentos.find(d => d.key === controlName)!;
    doc.file = file;

    this.form.get(controlName)!.setValue(input.files[0]);
    console.log(`Archivo "${file.name}" seleccionado para ${controlName}`);
  }

  async verDocumento(doc: Documento) {
    const url = `${environment.backendUrl}/documentos/${this.data.id}/${doc.key}`;
    try {
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const blob = await res.blob();

      const blobUrl = URL.createObjectURL(blob);
      this.dialog.open(DocumentViewerDialogComponent, {
        data: { blobUrl, label: doc.label, inline: doc.inline },
        width: '50vw',        // antes 80vw
        height: '90vh',       // antes 80vh
        maxWidth: '95vw',
        maxHeight: '95vh',
        panelClass: 'document-viewer-dialog'
      });
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }


  onSubmit() {
    if (this.form.invalid) {
      console.log(
        'Formulario inválido:', this.form.errors
      ); return;
    };
    this.form.updateValueAndValidity();

    console.log('RAW FORM VALUES:', this.form.getRawValue());

    if (!this.form.valid) {
      console.warn('Formulario inválido');
      return;
    }

    const formData = new FormData();
    const raw = this.form.getRawValue();
    if (typeof raw.giro === 'object' && raw.giro.name) {
      raw.giro = raw.giro.name;
    }
    if (typeof raw.subgiro === 'object' && raw.subgiro.name) {
      raw.subgiro = raw.subgiro.name;
    }
    Object.entries(raw).forEach(([key, value]) => {
      if (value instanceof Blob) {
        formData.append(key, value);
      } else {
        formData.append(key, value != null ? value.toString() : '');
      }
    });


    const debug: Array<{ key: string; value: any }> = [];
    formData.forEach((value, key) => {
      debug.push({ key, value });
    });
    console.log('FormData que se va a enviar:', debug);

    this.appService.updateAfiliacion(this.data.id, formData).subscribe({
      next: (resp) => {
        console.log('Éxito:', resp);
        this.snackBar.open('Afiliación creada exitosamente', 'Cerrar', { duration: 3000 });
        this.form.reset();
      },
      error: (err) => {
        console.error('Error al crear la afiliación:', err);

      }
    });
    this.dialogRef.close({ ...this.form.value, documentos: this.documentos });
  }
}


import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-document-viewer-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.label }}</h2>
    <mat-dialog-content class="dialog-content">
      <ng-container *ngIf="isPdf; else imageTpl">
        <iframe [src]="url" width="100%" height="100%"></iframe>
      </ng-container>
      <ng-template #imageTpl>
        <img [src]="url" alt="{{ data.label }}" style="max-width:100%; max-height:100%;" />
      </ng-template>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-content { height: 80vh; padding: 0; }
    iframe, img { border: none; }
  `]
})
export class DocumentViewerDialogComponent implements OnInit {
  url!: SafeResourceUrl;
  isPdf = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { blobUrl: string, label: string, inline: boolean },
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.isPdf = !this.data.inline;

    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.blobUrl);
  }
}

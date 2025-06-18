
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AppService } from '../../app.service';
import { NgFor, CommonModule } from '@angular/common';
import { environment } from '../../app.environment';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged, catchError } from 'rxjs/operators';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-restaurantes',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule, NgFor, MatButtonModule, FormsModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './restaurantes.component.html',
  styleUrl: './restaurantes.component.css'
})
export class RestaurantesComponent {
  searchTextChanged = new Subject<string>();
  noResults = false;

  environment = environment;
  restaurantes: any[] = [];
  searchText: string = "";

  isAdmin = false;
  constructor(private appService: AppService, private dialog: MatDialog) {

    this.appService.verifyAdmin().subscribe(
      (response: any) => {
        this.isAdmin = response.role === 'admin';

        console.log(this.isAdmin);
      },
      (error: any) => {
        console.error('Error verifying admin status:', error);
      }
    );
  }

  ngOnInit() {
    this.getRestaurantes();

    this.searchTextChanged.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((text) => {
        if (!text.trim()) {
          this.noResults = false;
          this.getRestaurantes();
          return of(null);
        }
        return this.appService.getAfiliacionPorNombreYGiro(text, "Restaurante").pipe(
          catchError(() => of([]))
        );
      })
    ).subscribe((result) => {
      if (result === null) return;
      this.restaurantes = result;
      this.noResults = result.length === 0;
    });

  }
  onSearchChange(value: string) {
    this.searchTextChanged.next(value);
  }


  getRestaurantes() {
    this.appService.getAfiliacionByGiro('Restaurante').subscribe(
      (response: any) => {
        this.restaurantes = response;
        console.log(this.restaurantes);
      },
      (error: any) => {
        console.error('Error fetching restaurantes:', error);
      }
    );
  }

  viewRestaurante(id: any) {
    const restaurantes = this.restaurantes.find(c => c.id === id);
    if (restaurantes) {
      this.dialog.open(RestauranteDialogComponent, {
        data: restaurantes,
        width: '500px',
        maxHeight: '90vh'
      });
    }
  }
}












interface Documento {
  key: string;
  label: string;
  url: string;
  inline: boolean;
  file?: File;
}
@Component({
  selector: 'app-restaurantes-dialog',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatCardModule,
    MatIconModule],
  template: `
    <mat-dialog-content class="dialog-content">

  <!-- GENERAL -->
  <section class="section">
    <h3>Datos generales</h3>
    <div class="row">
      <mat-form-field appearance="fill">
        <mat-label>Razón social</mat-label>
        <input matInput [(ngModel)]="data.razonSocial" [readonly]="isAdmin">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Nombre comercial</mat-label>
        <input matInput [(ngModel)]="data.nombreComercial" [readonly]="isAdmin">
      </mat-form-field>
    </div>
    <div class="row">
      <mat-form-field appearance="fill">
        <mat-label>Giro</mat-label>
        <input matInput [(ngModel)]="data.giro" [readonly]="isAdmin">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Subgiro</mat-label>
        <input matInput [(ngModel)]="data.subgiro" [readonly]="isAdmin">
      </mat-form-field>
    </div>
    <div class="row">
      <mat-form-field appearance="fill">
        <mat-label>Página web</mat-label>
        <input matInput [(ngModel)]="data.paginaWeb" [readonly]="isAdmin">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Facebook</mat-label>
        <input matInput [(ngModel)]="data.facebook" [readonly]="isAdmin">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Instagram</mat-label>
        <input matInput [(ngModel)]="data.instagram" [readonly]="isAdmin">
      </mat-form-field>
    </div>
  </section>

  <mat-divider></mat-divider>

  <!-- PROPIETARIO -->
  <section class="section">
    <h3>Datos del propietario</h3>
    <div class="row">
      <mat-form-field appearance="fill">
        <mat-label>Nombre</mat-label>
        <input matInput [(ngModel)]="data.nombrePropietario" [readonly]="isAdmin">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Teléfono</mat-label>
        <input matInput [(ngModel)]="data.telefonoPropietario" [readonly]="isAdmin">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Email</mat-label>
        <input matInput [(ngModel)]="data.emailPropietario" [readonly]="isAdmin">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Fecha de nacimiento</mat-label>
        <input matInput type="date" [(ngModel)]="data.fechaNacimientoPropietario" [readonly]="isAdmin">
      </mat-form-field>
    </div>
  </section>

  <mat-divider></mat-divider>

  <!-- GERENTE -->
  <section class="section">
    <h3>Datos del gerente</h3>
    <div class="row">
      <mat-form-field appearance="fill">
        <mat-label>Nombre</mat-label>
        <input matInput [(ngModel)]="data.nombreGerente" [readonly]="isAdmin">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Teléfono</mat-label>
        <input matInput [(ngModel)]="data.telefonoGerente" [readonly]="isAdmin">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Email</mat-label>
        <input matInput [(ngModel)]="data.emailGerente" [readonly]="isAdmin">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Fecha de nacimiento</mat-label>
        <input matInput type="date" [(ngModel)]="data.fechaNacimientoGerente" [readonly]="isAdmin">
      </mat-form-field>
    </div>
  </section>

  <mat-divider></mat-divider>

  <!-- FACTURACIÓN / PÓLIZA -->
  <section class="section">
    <h3>Facturación y póliza</h3>
    <div class="row">
      <mat-form-field appearance="fill">
        <mat-label>Código postal</mat-label>
        <input matInput [(ngModel)]="data.codigoPostal" [readonly]="isAdmin">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>RFC</mat-label>
        <input matInput [(ngModel)]="data.rfc" [readonly]="isAdmin">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Teléfono de oficina</mat-label>
        <input matInput [(ngModel)]="data.telefonoOficina" [readonly]="isAdmin">
      </mat-form-field>
    </div>
    <div class="row">
      <mat-form-field appearance="fill">
        <mat-label>Fecha de alta</mat-label>
        <input matInput type="date" [(ngModel)]="data.fechaAlta" [readonly]="isAdmin">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Fecha de afiliación</mat-label>
        <input matInput type="date" [(ngModel)]="data.fechaAfiliacion" [readonly]="isAdmin">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Fecha de vencimiento</mat-label>
        <input matInput type="date" [(ngModel)]="data.fechaVencimiento" [readonly]="isAdmin">
      </mat-form-field>
    </div>
    <div class="row">
      <mat-form-field appearance="fill">
        <mat-label>Póliza</mat-label>
        <input matInput [(ngModel)]="data.poliza" [readonly]="isAdmin">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Ubicación de póliza</mat-label>
        <input matInput [(ngModel)]="data.polizaUbicacion" [readonly]="isAdmin">
      </mat-form-field>
    </div>
    <div class="row">
      <mat-form-field appearance="fill">
        <mat-label>Número de factura</mat-label>
        <input matInput type="number" [(ngModel)]="data.numeroFactura" [readonly]="isAdmin">
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Importe de factura</mat-label>
        <input matInput type="number" [(ngModel)]="data.importeFactura" [readonly]="isAdmin">
      </mat-form-field>
    </div>
  </section>

  <mat-divider></mat-divider>

<section class="section docs-section" *ngIf="documentos.length">
  <h3>Documentos</h3>
  <mat-card *ngFor="let doc of documentos" class="doc-item">
    <mat-card-title>{{ doc.label }}</mat-card-title>
    <mat-card-content class="doc-content">
      <!-- VER DOCUMENTO -->
      <button mat-button color="accent" (click)="verDocumento(doc)">
        <mat-icon>visibility</mat-icon>
        Ver
      </button>

      <!-- SUBIR / REEMPLAZAR DOCUMENTO (solo admin) con validación -->
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
        [disabled]="isAdmin"
        (click)="fileInput.click()"
      >
        <mat-icon style="margin-right:6px">upload</mat-icon>
        {{ doc.file ? 'Cambiar archivo' : 'Subir archivo' }}
      </button>

      <!-- Nombre del archivo seleccionado -->
      <p *ngIf="doc.file" class="archivo-nombre">
        Archivo seleccionado: {{ doc.file.name }}
      </p>
    </mat-card-content>
  </mat-card>
</section>

</mat-dialog-content>

<mat-dialog-actions align="end">
  <button mat-button (click)="dialogRef.close()">Cerrar</button>
  <button mat-button color="primary" *ngIf="!isAdmin" (click)="onSave()">Guardar</button>
</mat-dialog-actions>

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




export class RestauranteDialogComponent {

  documentos: Documento[] = [];
  isAdmin: boolean;
  private fileConstraints: Record<string, { maxSize: number; types: string[] }> = {
    logoPng: { maxSize: 2 * 1024 * 1024, types: ['image/png'] },
    logoPdf: { maxSize: 2 * 1024 * 1024, types: ['application/pdf'] },
    default: { maxSize: 2 * 1024 * 1024, types: ['image/*', 'application/pdf'] }
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RestauranteDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    this.isAdmin = data.isAdmin;

    const backend = environment.backendUrl;
    const id = data.id;
    const docKeys = [
      'comprobanteSucursal',
      'comprobanteMatriz',
      'ine',
      'csf',
      'logoPdf',
      'logoPng'
    ];

    this.documentos = docKeys.map(key => ({
      key,
      label: this.toLabel(key),
      url: `${backend}/documentos/${id}/${key}`,
      inline: key === 'logoPng',
      file: undefined
    }));
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

  verDocumento(doc: Documento) {
    window.open(doc.url, '_blank');
  }

  acceptTypesFor(controlName: string): string {
    const constraint = this.fileConstraints[controlName] ?? this.fileConstraints['default'];

    return constraint.types.join(',');
  }

  onFileSelected(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const { maxSize, types } = this.fileConstraints[controlName] ?? this.fileConstraints['default'];


    if (file.size > maxSize) {
      this.snackBar.open(
        `“${file.name}” excede ${(maxSize / 1024 / 1024).toFixed(1)} MB.`,
        'Cerrar',
        { duration: 3000 }
      );
      input.value = '';
      return;
    }


    const validType: boolean = types.some((allowed: string): boolean => {
      if (allowed.endsWith('/*')) {
        return file.type.startsWith(allowed.slice(0, -1));
      }
      return file.type === allowed;
    });
    if (!validType) {
      this.snackBar.open(
        `Tipo no permitido para “${this.toLabel(controlName)}”. Permitted: ${types.join(', ')}`,
        'Cerrar',
        { duration: 3000 }
      );
      input.value = '';
      return;
    }


    const doc = this.documentos.find(d => d.key === controlName);
    if (doc) {
      doc.file = file;
      console.log('Nuevo archivo listo para subir:', controlName, file);
    }
  }
  onFileChange(event: Event, key: string) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const doc = this.documentos.find(d => d.key === key);
    if (doc) {
      doc.file = file;


      console.log('Nuevo archivo para', key, file);
    }
  }

  onSave() {


    this.documentos.forEach(doc => {
      if (doc.file) {

        console.log('Subir', doc.key, doc.file);
      }
    });
    this.dialogRef.close({ ...this.data, documentos: this.documentos });
  }
}
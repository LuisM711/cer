//afiliacion.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { AppService } from '../../app.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { HeaderComponent } from '../header/header.component';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-afiliacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatSnackBarModule,
    HeaderComponent,
    MatDividerModule,


  ],
  templateUrl: './afiliacion.component.html',
  styleUrls: ['./afiliacion.component.css']
})
export class AfiliacionComponent {
  public maxTabIndex: number = 5;
  // inject AppService

  afiliacionForm: FormGroup;
  selectedTabIndex = 0;
  // document: any;
  // giros = [
  //   {
  //     value: 1, name: 'Comercio',
  //     subgiros: [
  //       { value: 1, name: 'Abarrotes' },
  //       { value: 2, name: 'Electrónica' },
  //       { value: 3, name: 'Ropa y calzado' },
  //       { value: 4, name: 'Ferretería' },
  //       { value: 5, name: 'Paneles solares' },
  //       { value: 6, name: 'Papelería' },
  //       { value: 7, name: 'Deportes' }
  //     ]
  //   },
  //   {
  //     value: 2, name: 'Restuarante',
  //     subgiros: [
  //       { value: 1, name: 'Pizzería' },
  //       { value: 2, name: 'Sushi' },
  //       { value: 3, name: 'Comida china' },
  //       { value: 4, name: 'Café' },
  //       { value: 5, name: 'Tacos' },
  //       { value: 6, name: 'Cocina económica' },
  //       { value: 7, name: 'Mariscos' },
  //     ]
  //   }
  // ];
  // subgiros: { value: number, name: string }[] = [];
  giros: any[] = [];
  subgiros: any[] = [];





  onGiroChange(selectedGiro: any): void {
    this.subgiros = selectedGiro ? selectedGiro.subgiros : [];
    this.afiliacionForm.get('subgiro')?.reset();
  }


  documentos = [
    { name: 'comprobanteSucursal', label: 'Comprobante Dom. Sucursal' },
    { name: 'comprobanteMatriz', label: 'Comprobante Dom. Matriz' },
    { name: 'ine', label: 'INE' },
    { name: 'csf', label: 'CSF' },
    { name: 'logoPdf', label: 'Logotipo en PDF Editable' },
    { name: 'logoPng', label: 'Logotipo en PNG' },
  ];
  fileInput: any;
  selectedGiro: any;

  constructor(private fb: FormBuilder, private appService: AppService, private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.afiliacionForm = this.fb.group({
      razonSocial: ['', Validators.required],
      nombreComercial: ['', Validators.required],
      giro: ['', Validators.required],
      subgiro: ['', Validators.required],
      paginaWeb: [''],
      facebook: [''],
      googleMaps: [''],
      instagram: [''],
      domicilioFiscal: ['', Validators.required],
      domicilioSucursal: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      telefonoOficina: ['', Validators.required],
      rfc: ['', [Validators.required, Validators.pattern(/^([A-ZÑ&]{3,4}) ?-?([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01]) ?-?([A-Z\d]{3})$/i)]],
      nombrePropietario: ['', Validators.required],
      telefonoPropietario: ['', Validators.required],
      emailPropietario: ['', [Validators.required, Validators.email]],
      fechaNacimientoPropietario: ['', Validators.required],

      nombreGerente: ['', Validators.required],
      telefonoGerente: ['', Validators.required],
      emailGerente: ['', [Validators.required, Validators.email]],
      fechaNacimientoGerente: ['', Validators.required],

      comprobanteSucursal: [null, Validators.required],
      comprobanteMatriz: [null, Validators.required],
      fechaAlta: [new Date(), Validators.required],
      fechaAfiliacion: ['', Validators.required],
      fechaVencimiento: ['', Validators.required],
      poliza: ['', Validators.required],
      polizaUbicacion: ['', Validators.required],
      ine: ['', Validators.required],
      csf: ['', Validators.required],
      logoPdf: ['', Validators.required],
      logoPng: ['', Validators.required]
      // ine: [''],
      // csf: [''],
      // logoPdf: [''],
      // logoPng: ['']
    });
    this.loadGiros();
  }
  private loadGiros(): void {
    this.appService.getGiros().subscribe(
      (resp: any[]) => {
        // resp es array plano [{giro,subgiro},…]
        const map = new Map<string, { name: string; subgiros: { name: string }[] }>();
        resp.forEach(item => {
          if (!map.has(item.giro)) {
            map.set(item.giro, { name: item.giro, subgiros: [] });
          }
          const g = map.get(item.giro)!;
          if (!g.subgiros.some(s => s.name === item.subgiro)) {
            g.subgiros.push({ name: item.subgiro });
          }
        });
        this.giros = Array.from(map.values());
        // si ya había seleccionado un giro, refresca subgiros
        const cur = this.afiliacionForm.get('giro')!.value;
        if (cur) this.onGiroChange(cur);
      },
      err => {
        console.error(err);
        this.snackBar.open('No se pudieron cargar los giros', 'Cerrar', { duration: 3000 });
      }
    );
  }
  addSubgiro() {
    const selected = this.afiliacionForm.get('giro')!.value as { name: string; subgiros: any[] };
    if (!selected) {
      this.snackBar.open('Primero debes elegir un giro', 'Cerrar', { duration: 2000 });
      return;
    }

    const ref = this.dialog.open(AddSubgiroDialogComponent, {
      data: { giro: selected.name },
      width: '300px'
    });

    ref.afterClosed().subscribe((nuevo: string | undefined) => {
      if (!nuevo) { return; }
      this.appService.createGiro({ giro: selected.name, subgiro: nuevo })
        .subscribe({
          next: () => {
            this.snackBar.open('Subgiro agregado', 'Cerrar', { duration: 2000 });
            const nuevoObj = { name: nuevo };
            selected.subgiros.push(nuevoObj);
            this.subgiros = selected.subgiros;
            this.afiliacionForm.get('subgiro')!.setValue(nuevoObj);
          }
          ,
          error: () => {
            this.snackBar.open('Error al crear subgiro', 'Cerrar', { duration: 3000 });
          }
        });
    });
  }


  nextTab(): void {
    const currentGroup = this.getCurrentTabControls();
    if (currentGroup.valid) {
      this.selectedTabIndex = Math.min(this.selectedTabIndex + 1, this.maxTabIndex);
    } else {
      currentGroup.markAllAsTouched();
    }
  }

  prevTab(): void {
    this.selectedTabIndex = Math.max(this.selectedTabIndex - 1, 0);
  }
  getCurrentTabControls(): FormGroup {
    const controlGroups = [
      // 0: Datos generales
      ['razonSocial', 'nombreComercial', 'giro', 'subgiro'],
      // 1: Giro y contacto
      ['paginaWeb', 'facebook', 'googleMaps', 'instagram'],
      // 2: Propiedad
      ['nombrePropietario', 'telefonoPropietario', 'emailPropietario', 'fechaNacimientoPropietario',
        'nombreGerente', 'telefonoGerente', 'emailGerente', 'fechaNacimientoGerente'],
      // 3: Datos fiscales
      ['domicilioFiscal', 'domicilioSucursal', 'codigoPostal', 'rfc', 'telefonoOficina'],
      // 4: Fechas
      ['fechaAlta', 'fechaAfiliacion', 'fechaVencimiento', 'poliza', 'polizaUbicacion'],
      // 5: Documentos
      ['comprobanteSucursal', 'comprobanteMatriz', 'ine', 'csf', 'logoPdf', 'logoPng']
    ];

    const names = controlGroups[this.selectedTabIndex] || [];
    const group: { [key: string]: any } = {};
    names.forEach(name => {
      group[name] = this.afiliacionForm.get(name);
    });
    return this.fb.group(group);
  }


  isControlInvalid(controlName: string): boolean {
    const control = this.afiliacionForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  /** Restricciones de archivos por controlName */
  private fileConstraints: Record<string, { maxSize: number; types: string[] }> = {
    // Solo PNG
    logoPng: { maxSize: 2 * 1024 * 1024, types: ['image/png'] },
    // Solo PDF
    logoPdf: { maxSize: 2 * 1024 * 1024, types: ['application/pdf'] },
    // Para todos los demás: imágenes o PDF
    default: { maxSize: 2 * 1024 * 1024, types: ['image/*', 'application/pdf'] }
  };

  /** Maneja la selección de archivos con restricciones centralizadas */
  onFileSelected(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    // Accede a la restricción específica o a la de 'default' usando corchetes
    const constraint = this.fileConstraints[controlName]
      ?? this.fileConstraints['default'];
    const { maxSize, types } = constraint;

    // 1️⃣ Valida tamaño
    if (file.size > maxSize) {
      this.snackBar.open(
        `“${file.name}” excede ${(maxSize / 1024 / 1024).toFixed(1)} MB.`,
        'Cerrar',
        { duration: 3000 }
      );
      input.value = '';
      this.afiliacionForm.get(controlName)!.reset();
      return;
    }

    // 2️⃣ Valida MIME
    const validType = types.some(allowed => {
      if (allowed.endsWith('/*')) {
        return file.type.startsWith(allowed.slice(0, -1));
      }
      return file.type === allowed;
    });

    if (!validType) {
      this.snackBar.open(
        `Tipo no permitido para “${controlName}”. Permitted: ${types.join(', ')}`,
        'Cerrar',
        { duration: 3000 }
      );
      input.value = '';
      return;
    }

    // 3️⃣ Asigna al control
    this.afiliacionForm.get(controlName)!.setValue(file);
  }



  onSubmit(): void {
    this.afiliacionForm.updateValueAndValidity();

    console.log('RAW FORM VALUES:', this.afiliacionForm.getRawValue());

    if (!this.afiliacionForm.valid) {
      console.warn('Formulario inválido');
      return;
    }

    const formData = new FormData();
    const raw = this.afiliacionForm.getRawValue();
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

    // → Aquí: recorrer con forEach en lugar de entries()
    const debug: Array<{ key: string; value: any }> = [];
    formData.forEach((value, key) => {
      debug.push({ key, value });
    });
    console.log('FormData que se va a enviar:', debug);

    this.appService.createAfiliacion(formData).subscribe({
      next: (resp) => {
        console.log('Éxito:', resp);
        this.snackBar.open('Afiliación creada exitosamente', 'Cerrar', { duration: 3000 });
        this.afiliacionForm.reset();
      },
      error: (err) => {
        console.error('Error al crear la afiliación:', err);
        // no resetees el form, permite corregir y volver a enviar
      }
    });
  }


}




@Component({
  selector: 'add-subgiro-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Nuevo subgiro para {{ data.giro }}</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Nombre del subgiro</mat-label>
        <input matInput [(ngModel)]="subgiro" placeholder="e.g. Lácteos">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="!subgiro" (click)="ok()">Agregar</button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; }`]
})
export class AddSubgiroDialogComponent {
  subgiro = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { giro: string },
    private dialogRef: MatDialogRef<AddSubgiroDialogComponent>
  ) { }
  ok() { this.dialogRef.close(this.subgiro.trim()); }
}

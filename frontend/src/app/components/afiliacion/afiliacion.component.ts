
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';

import { AppService } from '../../app.service';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-afiliacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDividerModule,
    MatDialogModule,
    HeaderComponent,

  ],
  templateUrl: './afiliacion.component.html',
  styleUrls: ['./afiliacion.component.css']
})
export class AfiliacionComponent {
  maxTabIndex = 5;
  selectedTabIndex = 0;
  giros: any[] = [];
  subgiros: any[] = [];
  documentos = [
    { name: 'comprobanteSucursal', label: 'Comprobante Dom. Sucursal' },
    { name: 'comprobanteMatriz', label: 'Comprobante Dom. Matriz' },
    { name: 'ine', label: 'INE' },
    { name: 'csf', label: 'CSF' },
    { name: 'logoPdf', label: 'Logotipo en PDF Editable' },
    { name: 'logoPng', label: 'Logotipo en PNG' },
  ];

  afiliacionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {

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
      rfc: ['', [Validators.required]],
      nombrePropietario: ['', Validators.required],
      telefonoPropietario: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      emailPropietario: ['', [Validators.required, Validators.email]],
      fechaNacimientoPropietario: ['', Validators.required],
      nombreGerente: ['', Validators.required],
      telefonoGerente: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      emailGerente: ['', [Validators.required, Validators.email]],
      fechaNacimientoGerente: ['', Validators.required],
      comprobanteSucursal: [null, Validators.required],
      comprobanteMatriz: [null, Validators.required],
      fechaAlta: [new Date(), Validators.required],
      fechaAfiliacion: ['', Validators.required],
      fechaVencimiento: ['', Validators.required],
      poliza: ['', Validators.required],
      polizaUbicacion: ['', Validators.required],
      numeroFactura: ['', Validators.required],
      importeFactura: ['', Validators.required],
      ine: ['', Validators.required],
      csf: ['', Validators.required],
      logoPdf: ['', Validators.required],
      logoPng: ['', Validators.required]
    });


    this.loadGiros();





    this.afiliacionForm.valueChanges.subscribe(() => {
      this.afiliacionForm.updateValueAndValidity({ onlySelf: false, emitEvent: false });
    });
  }

  private loadGiros() {
    this.appService.getGiros().subscribe({
      next: (resp: any[]) => {
        const map = new Map<string, { name: string; subgiros: any[] }>();
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
        const cur = this.afiliacionForm.get('giro')!.value;
        if (cur) this.onGiroChange(cur);
      },
      error: () => {
        this.snackBar.open('No se pudieron cargar los giros', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onGiroChange(selectedGiro: any) {
    this.subgiros = selectedGiro?.subgiros || [];
    this.afiliacionForm.get('subgiro')!.reset();
  }

  fileInput: any;
  selectedGiro: any;


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

      ['razonSocial', 'nombreComercial', 'giro', 'subgiro'],

      ['paginaWeb', 'facebook', 'googleMaps', 'instagram'],

      ['nombrePropietario', 'telefonoPropietario', 'emailPropietario', 'fechaNacimientoPropietario',
        'nombreGerente', 'telefonoGerente', 'emailGerente', 'fechaNacimientoGerente'],

      ['domicilioFiscal', 'domicilioSucursal', 'codigoPostal', 'rfc', 'telefonoOficina'],

      ['fechaAlta', 'fechaAfiliacion', 'fechaVencimiento', 'poliza', 'polizaUbicacion', 'numeroFactura',
        'importeFactura'],

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

    logoPng: { maxSize: 2 * 1024 * 1024, types: ['image/png'] },

    logoPdf: { maxSize: 2 * 1024 * 1024, types: ['application/pdf'] },

    default: { maxSize: 2 * 1024 * 1024, types: ['image/*', 'application/pdf'] }
  };

  /** Maneja la selección de archivos con restricciones centralizadas */
  onFileSelected(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    const constraint = this.fileConstraints[controlName]
      ?? this.fileConstraints['default'];
    const { maxSize, types } = constraint;


    if (file.size > maxSize) {
      this.snackBar.open(
        `“${file.name}” excede ${(maxSize / 1024 / 1024).toFixed(1)} MB.`,
        'Cerrar',
        { duration: 3000 }
      );
      input.value = '';
      this.afiliacionForm.get(controlName)!.reset();
      this.afiliacionForm.get(controlName)!.markAsTouched();
      this.afiliacionForm.get(controlName)!.markAsDirty();
      this.afiliacionForm.updateValueAndValidity();

      return;
    }


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


    this.afiliacionForm.get(controlName)!.setValue(file);
    this.afiliacionForm.get(controlName)!.markAsDirty();
    this.afiliacionForm.get(controlName)!.markAsTouched();
    this.afiliacionForm.updateValueAndValidity();

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
    //get giro
    const giro = `${raw.giro}s`.toLowerCase();
    console.log("GIRO");
    console.log(giro);

    const debug: Array<{ key: string; value: any }> = [];
    formData.forEach((value, key) => {
      debug.push({ key, value });
    });
    console.log('FormData que se va a enviar:', debug);

    this.appService.createAfiliacion(formData).subscribe({
      next: (resp) => {
        console.log('Éxito:', resp);
        this.snackBar.open('Afiliación creada exitosamente', 'Cerrar', { duration: 3000 });
        //routerlink to comercios/restaurantes 
        // window.location.href = '/comercios';
        this.router.navigate([`/${giro}`]);
      },
      error: (err) => {
        console.error('Error al crear la afiliación:', err);

      }
    });
  }
  debug() {
    console.log('DEBUG FORM:', this.afiliacionForm.getRawValue());
    console.log('DEBUG GIROS:', this.giros);
    console.log('DEBUG SUBGIROS:', this.subgiros);
    console.log('Is form valid?', this.afiliacionForm.valid);
    const invalid = [];
    const controls = this.afiliacionForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log('Invalid controls:', invalid);

  }
  isFormValid(): boolean {
    return Object.values(this.afiliacionForm.controls).every(control => !control.invalid);
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

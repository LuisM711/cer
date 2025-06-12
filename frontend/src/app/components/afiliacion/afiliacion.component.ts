import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule
  ],
  templateUrl: './afiliacion.component.html',
  styleUrls: ['./afiliacion.component.css']
})
export class AfiliacionComponent {

  afiliacionForm: FormGroup;
  selectedTabIndex = 0;
  // document: any;
  giros = [
    {
      value: 1, name: 'Comercio',
      subgiros: [
        { value: 1, name: 'Abarrotes' },
        { value: 2, name: 'Electrónica' },
        { value: 3, name: 'Ropa y calzado' },
        { value: 4, name: 'Ferretería' },
        { value: 5, name: 'Paneles solares' },
        { value: 6, name: 'Papelería' },
        { value: 7, name: 'Deportes' }
      ]
    },
    {
      value: 2, name: 'Restuarante',
      subgiros: [
        { value: 1, name: 'Pizzería' },
        { value: 2, name: 'Sushi' },
        { value: 3, name: 'Comida china' },
        { value: 4, name: 'Café' },
        { value: 5, name: 'Tacos' },
        { value: 6, name: 'Cocina económica' },
        { value: 7, name: 'Mariscos' },
      ]
    }
  ];
  subgiros: { value: number, name: string }[] = [];

  onGiroChange(selectedGiroValue: number): void {
    const selectedGiro = this.giros.find(g => g.value === selectedGiroValue);
    this.subgiros = selectedGiro ? selectedGiro.subgiros : [];

    // Resetear subgiro al cambiar giro
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

  constructor(private fb: FormBuilder) {
    this.afiliacionForm = this.fb.group({
      razonSocial: ['', Validators.required],
      nombreComercial: [''],
      giro: ['', Validators.required],
      subgiro: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      paginaWeb: [''],
      facebook: [''],
      googleMaps: [''],
      instagram: [''],
      dominioFiscal: [''],
      domicilioSucursal: ['', Validators.required],
      rfc: ['', [Validators.required, Validators.pattern(/^([A-ZÑ&]{3,4}) ?-?([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01]) ?-?([A-Z\d]{3})$/i)]],
      telefonoOficina: [''],
      telefonoPropietario: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      comprobanteSucursal: [null],
      comprobanteMatriz: [null],
      ine: ['', Validators.required],
      csf: ['', Validators.required],
      logoPdf: ['', Validators.required],
      logoPng: ['', Validators.required]
    });
  }

  nextTab(): void {
    const currentGroup = this.getCurrentTabControls();
    if (currentGroup.valid) {
      this.selectedTabIndex++;
    } else {
      currentGroup.markAllAsTouched();
    }
  }

  prevTab(): void {
    this.selectedTabIndex--;
  }

  getCurrentTabControls(): FormGroup {
    const controlGroups = [
      ['razonSocial', 'nombreComercial'],
      ['giro','subgiro', 'email', 'paginaWeb', 'facebook', 'googleMaps', 'instagram'],
      ['dominioFiscal', 'domicilioSucursal', 'rfc', 'telefonoOficina', 'telefonoPropietario', 'fechaNacimiento'],
      ['comprobanteSucursal', 'comprobanteMatriz', 'ine', 'csf', 'logoPdf', 'logoPng']
    ];
    const controls = controlGroups[this.selectedTabIndex];
    const group: any = {};
    controls.forEach(name => group[name] = this.afiliacionForm.get(name));
    return this.fb.group(group);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.afiliacionForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  onFileSelected(event: Event, controlName: string): void {
    // Asegurarse de que el evento es del tipo correcto
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.afiliacionForm.get(controlName)?.setValue(input.files[0]);
    }
  }

  onSubmit(): void {
    if (this.afiliacionForm.valid) {
      const formData = new FormData();
      Object.entries(this.afiliacionForm.value).forEach(([key, value]) => {
        if (value instanceof Blob) {
          formData.append(key, value);
        } else if (typeof value === 'string') {
          formData.append(key, value);
        } else {
          formData.append(key, value != null ? value.toString() : '');
        }
      });
      // Aquí puedes enviar formData al backend
      console.log('Formulario válido. Enviando datos...', formData);
    } else {
      console.log('Formulario inválido');
    }
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule
  ],
  templateUrl: './afiliacion.component.html',
  styleUrls: ['./afiliacion.component.css']
})
export class AfiliacionComponent {
  afiliacionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.afiliacionForm = this.fb.group({
      razonSocial: ['', Validators.required],
      nombreComercial: [''],
      dominioFiscal: [''],
      domicilioSucursal: ['', Validators.required],
      rfc: ['', [Validators.required, Validators.pattern('^[A-ZÑ&]{3,4}\\d{6}[A-Z0-9]{3}$')]],
      telefonoOficina: [''],
      telefonoPropietario: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      giro: [''],
      email: ['', [Validators.required, Validators.email]],
      paginaWeb: [''],
      facebook: [''],
      googleMaps: [''],
      instagram: [''],
      comprobanteSucursal: [null],
      comprobanteMatriz: [null],
      ine: [null],
      csf: [null],
      logoPdf: [null],
      logoPng: [null]
    });
  }

  onFileSelected(event: any, controlName: string) {
    const file: File = event.target.files[0];
    if (file) {
      this.afiliacionForm.get(controlName)?.setValue(file);
    }
  }

  onSubmit() {
    if (this.afiliacionForm.valid) {
      console.log('Formulario enviado:', this.afiliacionForm.value);
      // Aquí iría la lógica para enviar el formulario
    }
  }
}
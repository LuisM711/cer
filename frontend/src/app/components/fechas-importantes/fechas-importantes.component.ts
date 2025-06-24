import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppService } from '../../app.service';

interface Afiliacion {
  id: number;
  razonSocial: string;
  nombrePropietario: string;
  fechaNacimientoPropietario: string;
  fechaVencimiento: string;
}

interface FechaImportante {
  afiliacionId: number;
  razonSocial: string;
  nombrePropietario: string;
  tipo: 'Cumpleaños' | 'Vencimiento';
  fecha: Date;
}

@Component({
  selector: 'app-fechas-importantes',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatButtonModule,
    HeaderComponent

  ],
  templateUrl: './fechas-importantes.component.html',
  styleUrls: ['./fechas-importantes.component.css']
})
export class FechasImportantesComponent implements OnInit {
  displayedColumns = ['icon', 'fecha', 'razonSocial', 'propietario', 'accion'];
  birthdayItems: FechaImportante[] = [];
  vencimientoItems: FechaImportante[] = [];

  constructor(private appService: AppService, private dialog: MatDialog) { }

  ngOnInit() {
    this.appService.getAfiliaciones().subscribe(
      (res: Afiliacion[]) => {
        const hoy = new Date();
        const allFechas: FechaImportante[] = [];

        for (const a of res) {

          const nac = new Date(a.fechaNacimientoPropietario);
          const cumpleEsteAño = new Date(
            hoy.getFullYear(), nac.getMonth(), nac.getDate()
          );
          const proximoCumple = (cumpleEsteAño >= hoy)
            ? cumpleEsteAño
            : new Date(hoy.getFullYear() + 1, nac.getMonth(), nac.getDate());

          allFechas.push({
            afiliacionId: a.id,
            razonSocial: a.razonSocial,
            nombrePropietario: a.nombrePropietario,
            tipo: 'Cumpleaños',
            fecha: proximoCumple
          });


          const venc = new Date(a.fechaVencimiento);
          allFechas.push({
            afiliacionId: a.id,
            razonSocial: a.razonSocial,
            nombrePropietario: a.nombrePropietario,
            tipo: 'Vencimiento',
            fecha: venc
          });
        }


        const sorted = allFechas.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
        this.birthdayItems = sorted.filter(f => f.tipo === 'Cumpleaños');
        this.vencimientoItems = sorted.filter(f => f.tipo === 'Vencimiento');
      },
      err => console.error('Error fetching fechas importantes:', err)
    );
  }

  icono(tipo: 'Cumpleaños' | 'Vencimiento') {
    return tipo === 'Cumpleaños' ? 'cake' : 'event';
  }
  renovar(item: FechaImportante) {
    const ref = this.dialog.open(RenewExpirationDialogComponent, {
      data: {
        afiliacionId: item.afiliacionId,
        currentFecha: item.fecha
      }
    });


    ref.afterClosed().subscribe(newFecha => {
      if (newFecha) {
        this.appService.actualizarFechaVencimiento(
          item.afiliacionId.toString(),
          { fechaVencimiento: newFecha.toISOString().slice(0, 10) }
        ).subscribe(() => {
          // Actualiza la fecha del ítem
          item.fecha = newFecha;

          // Crea un nuevo array, ordénalo y así Angular volverá a renderizarlo
          this.vencimientoItems = [
            ...this.vencimientoItems
          ].sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
        }, err => console.error(err));
      }
    });
  }
  generarCarta(item: FechaImportante) {
    const id = item.afiliacionId;
    this.appService.getAfiliacionById(id.toString()).subscribe(
      (afiliacion) => {
        console.log(afiliacion);
        const printContents = `
            <html>
        <head>
          <title>Reafiliación ${afiliacion.razonSocial}</title>
          <style>
            @page { margin: 2cm 1cm; }
            body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            .content {
              display: flex;
              flex-direction: column;
              margin-top: 100px;
              line-height:1.8;
            }
            p {
              margin: 0;
              font-size: 18px;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div style="position: absolute; top: 10px; right: 20px; font-size: 14px;">
            <strong>Fecha:</strong> 
            ${new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
          <div class="content">
            <p><strong>RAZÓN SOCIAL:</strong> ${afiliacion.razonSocial}</p>
            <p><strong>NOMBRE COMERCIAL:</strong> ${afiliacion.nombreComercial}</p>
            <p><strong>DIRECCIÓN SUCURSAL:</strong> ${afiliacion.domicilioSucursal}</p>
            <p><strong>FECHA DE AFILIACIÓN:</strong>
              ${new Date(afiliacion.fechaAfiliacion).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            <p><strong>FECHA DE VENCIMIENTO:</strong> 
              ${new Date(afiliacion.fechaVencimiento).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
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
      },
      (err) => {
        console.error('Error al obtener la afiliación:', err);
      }
    );


  }
}














import { Inject } from '@angular/core';

import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormControl, Validators, FormGroup, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
export interface RenewDialogData {
  afiliacionId: number;
  currentFecha: Date;
}

@Component({
  selector: 'app-renew-expiration-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>Renovar membresía</h2>
    <mat-dialog-content [formGroup]="form">
      <p>Fecha actual de vencimiento:
        <strong>{{ data.currentFecha | date:'mediumDate' }}</strong>
      </p>
      <mat-form-field appearance="fill">
        <mat-label>Nueva fecha de vencimiento</mat-label>
        <input matInput [matDatepicker]="picker" formControlName="newFecha">
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
        <mat-error *ngIf="form.controls['newFecha'].hasError('required')">
          Es obligatoria
        </mat-error>
        <mat-error *ngIf="form.controls['newFecha'].hasError('dateTooEarly')">
          Debe ser posterior a la fecha actual
        </mat-error>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancelar</button>
      <button mat-button color="primary" [disabled]="form.invalid" (click)="confirm()">
        Confirmar
      </button>
    </mat-dialog-actions>
  `
})
export class RenewExpirationDialogComponent {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RenewDialogData,
    private dialogRef: MatDialogRef<RenewExpirationDialogComponent>
  ) {
    this.form = new FormGroup({
      newFecha: new FormControl<Date | null>(null, [
        Validators.required,
        this.afterCurrentDateValidator(this.data.currentFecha)
      ])
    });
  }

  /**
   * Validador personalizado que comprueba que la fecha sea estrictamente posterior a la actual.
   */
  afterCurrentDateValidator(minDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selected: Date | null = control.value;
      if (!selected) {
        return null;
      }
      return selected.getTime() > minDate.getTime()
        ? null
        : { dateTooEarly: true };
    };
  }

  close(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    const fecha: Date = this.form.value.newFecha!;
    this.dialogRef.close(fecha);
  }
}

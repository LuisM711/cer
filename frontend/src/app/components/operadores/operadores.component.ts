import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppService } from '../../app.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HeaderComponent } from '../header/header.component';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@Component({
  selector: 'app-operadores',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatDialogModule,
    HeaderComponent,
    MatCardModule
  ],
  templateUrl: './operadores.component.html',
  styleUrls: ['./operadores.component.css']
})
export class OperadoresComponent implements OnInit {
  displayedColumns = ['id', 'nombre', 'email', 'telefono', 'isActive', 'acciones'];
  operadores: any[] = [];
  form!: FormGroup;
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: [''],
      isActive: [true]
    });
    this.loadOperadores();
  }

  loadOperadores() {
    this.appService.getAdmins().subscribe(admins => {
      this.operadores = admins.filter((a: any) => a.tipo === 'operador');
    });
  }

  // abrir modal de edición/creación
  openEditDialog(op?: any) {
    const ref = this.dialog.open(EditOperadorDialogComponent, {
      width: '400px',
      data: { operador: op ?? null }
    });
    ref.afterClosed().subscribe(saved => {
      if (saved) this.loadOperadores();
    });
  }

  // abrir modal de confirmación de borrado
  openDeleteDialog(op: any) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { nombre: op.nombre }
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed) this.deleteConfirmed(op);
    });
  }

  private deleteConfirmed(op: any) {
    this.appService.deleteAdmin(op.id.toString()).subscribe({
      next: () => {
        this.snackBar.open('Operador desactivado', '', { duration: 2000 });
        this.loadOperadores();
      },
      error: () => {
        this.snackBar.open('Error al eliminar', '', { duration: 2000 });
      }
    });
  }
}


/** Modal de confirmación */
@Component({
  selector: 'confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatDividerModule],
  template: `
    <h2 mat-dialog-title>Eliminar operador</h2>
    <mat-dialog-content>
      ¿Deseas eliminar a <strong>{{ data.nombre }}</strong>?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close="false">No</button>
      <button mat-button color="warn" [mat-dialog-close]="true" cdkFocusInitial>Sí</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { nombre: string }) { }
}


/** Modal de alta/edición */
@Component({
  selector: 'edit-operador-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSlideToggleModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ data.operador ? 'Editar' : 'Nuevo' }} Operador
    </h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <mat-dialog-content class="dialog-content">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre">
          <mat-error *ngIf="form.get('nombre')?.invalid">Obligatorio</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email">
          <mat-error *ngIf="form.get('email')?.hasError('required')">Obligatorio</mat-error>
          <mat-error *ngIf="form.get('email')?.hasError('email')">Inválido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Contraseña</mat-label>
          <input matInput type="password" formControlName="password">
          <mat-error *ngIf="form.get('password')?.hasError('required')">Obligatorio</mat-error>
          <mat-error *ngIf="form.get('password')?.hasError('minlength')">
            Mínimo 6 caracteres
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="telefono">
        </mat-form-field>

        <mat-slide-toggle formControlName="isActive">
          Activo
        </mat-slide-toggle>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancelar</button>
        <button mat-button color="primary" type="submit" [disabled]="form.invalid">
          Guardar
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .full-width { width: 100%; }
    .dialog-content { display: flex; flex-direction: column; gap: 1rem; }
  `]
})
export class EditOperadorDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { operador: any },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditOperadorDialogComponent>,
    private appService: AppService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    const op = this.data.operador;
    this.form = this.fb.group({
      nombre: [op?.nombre || '', Validators.required],
      email: [op?.email || '', [Validators.required, Validators.email]],
      password: ['', op ? [] : [Validators.required, Validators.minLength(6)]],
      telefono: [op?.telefono || ''],
      isActive: [op?.isActive ?? true]
    });
  }

  save() {
    if (this.form.invalid) return;
    const payload = { ...this.form.value, tipo: 'operador' };

    const req$ = this.data.operador
      ? this.appService.updateAdmin(this.data.operador.id.toString(), payload)
      : this.appService.createAdmin(payload);

    req$.subscribe({
      next: () => {
        this.snackBar.open(
          this.data.operador ? 'Operador actualizado' : 'Operador creado',
          '', { duration: 2000 }
        );
        this.dialogRef.close(true);
      },
      error: () => {
        this.snackBar.open('Error al guardar', '', { duration: 2000 });
      }
    });
  }
}

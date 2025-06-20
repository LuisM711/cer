// subgiros.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatSelectModule }     from '@angular/material/select';
import { AppService } from '../../app.service';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { HeaderComponent } from '../header/header.component';

interface Subgiro {
  id: number;
  giro: string;
  subgiro: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-subgiros',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatDividerModule,
    HeaderComponent
  ],
  templateUrl: './subgiros.component.html',
  styleUrls: ['./subgiros.component.css']
})
export class SubgirosComponent implements OnInit {
  subgiros: Subgiro[] = [];
  girosList: string[] = [];
  displayedColumns = ['id','giro','subgiro','actions'];

  constructor(
    private appService: AppService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSubgiros();
  }

  private loadSubgiros() {
    this.appService.getGiros().subscribe(
      (res: Subgiro[]) => {
        this.subgiros = res;
        this.girosList = Array.from(new Set(res.map(r => r.giro)));
      },
      err => console.error(err)
    );
  }

  /** Abre diálogo para crear un nuevo subgiro */
  addSubgiro() {
    const dialogRef = this.dialog.open(SubgiroDialogComponent, {
      width: '400px',
      data: { mode: 'add', giros: this.girosList }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appService.createGiro(result).subscribe(
          () => this.loadSubgiros(),
          err => console.error(err)
        );
      }
    });
  }

  /** Abre diálogo para editar un subgiro existente */
  editSubgiro(record: Subgiro) {
    const dialogRef = this.dialog.open(SubgiroDialogComponent, {
      width: '400px',
      data: { mode: 'edit', giros: this.girosList, record }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.appService.updateSubgiro(record.id.toString(), result).subscribe(
          () => this.loadSubgiros(),
          err => console.error(err)
        );
      }
    });
  }
}


/** Componente de diálogo para crear/editar */
@Component({
  selector: 'app-subgiro-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>
      {{ data.mode === 'add' ? 'Agregar subgiro' : 'Editar subgiro' }}
    </h2>
    <form [formGroup]="form" (ngSubmit)="onSave()">
      <mat-dialog-content class="d-flex flex-column gap-3">
        <mat-form-field>
          <mat-label>Giro</mat-label>
          <mat-select formControlName="giro" required>
            <mat-option *ngFor="let g of data.giros" [value]="g">{{ g }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Subgiro</mat-label>
          <input matInput formControlName="subgiro" required minlength="2" />
          <mat-error *ngIf="form.controls['subgiro'].hasError('required')">
            El subgiro es obligatorio
          </mat-error>
          <mat-error *ngIf="form.controls['subgiro'].hasError('minlength')">
            Mínimo 2 caracteres
          </mat-error>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
          {{ data.mode === 'add' ? 'Crear' : 'Actualizar' }}
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class SubgiroDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SubgiroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      mode: 'add' | 'edit',
      giros: string[],
      record?: Subgiro
    }
  ) {
    this.form = this.fb.group({
      giro: [ data.record?.giro || '', Validators.required ],
      subgiro: [ data.record?.subgiro || '',
        [ Validators.required, Validators.minLength(2) ] ]
    });
  }

  onSave() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}

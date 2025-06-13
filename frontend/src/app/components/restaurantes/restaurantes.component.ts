import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AppService } from '../../app.service';
import { NgFor, CommonModule } from '@angular/common';
import { environment } from '../../app.environment';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged, catchError } from 'rxjs/operators';
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

  constructor(private appService: AppService, private dialog: MatDialog) { }

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













@Component({
  selector: 'app-restaurantes-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.nombreComercial }}</h2>
    <mat-dialog-content style="display: flex; flex-direction: column; gap: 10px; text-align: center;">
      <p><strong>Razón Social:</strong> {{ data.razonSocial }}</p>
      <p><strong>Giro:</strong> {{ data.giro }}</p>
      <p><strong>Subgiro:</strong> {{ data.subgiro }}</p>
      <p><strong>Email:</strong> {{ data.email }}</p>
      <p *ngIf="data.paginaWeb">
        <strong>Página Web:</strong> 
        <a [href]="data.paginaWeb" target="_blank">{{ data.paginaWeb }}</a>
      </p>
      <p *ngIf="data.facebook">
        <strong>Facebook:</strong>
        <a [href]="data.facebook" target="_blank">{{ data.facebook }}</a>
      </p>
      <p *ngIf="data.googleMaps">
        <strong>Google Maps:</strong>
        <a [href]="data.googleMaps" target="_blank">Ver ubicación</a>
      </p>
      <p *ngIf="data.instagram">
        <strong>Instagram:</strong>
        <a [href]="data.instagram" target="_blank">{{ data.instagram }}</a>
      </p>
      <p><strong>Domicilio Fiscal:</strong> {{ data.domicilioFiscal }}</p>
      <p><strong>Domicilio Sucursal:</strong> {{ data.domicilioSucursal }}</p>
      <p><strong>RFC:</strong> {{ data.rfc }}</p>
      <p><strong>Tel. Oficina:</strong> {{ data.telefonoOficina }}</p>
      <p><strong>Tel. Propietario:</strong> {{ data.telefonoPropietario }}</p>
      <p>
        <strong>Fecha de Nacimiento:</strong> 
        {{ data.fechaNacimiento | date:'longDate':'':'es-MX' }}
      </p>

      <div *ngIf="documentos.length" style="margin-top: 20px;">
        <h3>Documentos</h3>
        <div *ngFor="let doc of documentos" style="margin-bottom: 10px;">
          <p><strong>{{ doc.label }}:</strong></p>
          <ng-container *ngIf="!doc.inline; else imagen">
            <a [href]="doc.url" target="_blank">Ver documento</a>
          </ng-container>
          <ng-template #imagen>
            <img [src]="doc.url" alt="{{ doc.label }}" style="max-width: 100%; max-height: 200px; border: 1px solid #ccc; border-radius: 4px;">
          </ng-template>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `
})
export class RestauranteDialogComponent {
  documentos: { label: string, url: string, inline: boolean }[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    const backend = environment.backendUrl;
    const id = data.id;

    const docKeys = ['comprobanteSucursal', 'comprobanteMatriz', 'ine', 'csf', 'logoPdf', 'logoPng'];

    // Utilizamos el endpoint que ya abstrae la extensión del archivo
    this.documentos = docKeys.map(key => ({
      label: this.toLabel(key),
      url: `${backend}/documentos/${id}/${key}`,
      // Suponemos que solo 'logoPng' se muestra inline; el resto se abrirá en una nueva pestaña.
      inline: key === 'logoPng'
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
}
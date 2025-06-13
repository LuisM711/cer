import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './app.environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  createAfiliacion(data: any): Observable<any> {
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      `${environment.backendUrl}/afiliaciones`, data,
      {  withCredentials: true }
    );
  }
  getAfiliacionByGiro(giro: string): Observable<any> {
    return this.http.get(
      `${environment.backendUrl}/afiliaciones/giro/${giro}`,
      { withCredentials: true }
    );
  }
  //router.get('/documentos/:id/:tipo', documentosController.getDocumento);
  getDocumento(id: string, tipo: string): Observable<any> {
    return this.http.get(
      `${environment.backendUrl}/documentos/${id}/${tipo}`,
      { responseType: 'blob', withCredentials: true }
    );
  }

  //    router.get('/afiliaciones/nombre/:nombreComercial/:giro', afiliacionController.getAfiliacionPorNombreYGiro);

  getAfiliacionPorNombreYGiro(nombreComercial: string, giro: string): Observable<any> {
    return this.http.get(
      `${environment.backendUrl}/afiliaciones/nombre/${nombreComercial}/${giro}`,
      { withCredentials: true }
    );
  }

  getBirthdays(): Observable<any> {
    return this.http.get(
      `${environment.backendUrl}/birthdays`,
      { withCredentials: true }
    );
  }
}

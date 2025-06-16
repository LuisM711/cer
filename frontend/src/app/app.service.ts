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
      { withCredentials: true }
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
  createAdmin(data: any): Observable<any> {
    return this.http.post(
      `${environment.backendUrl}/crear-admin`, data,
      { withCredentials: true }
    );
  }

  getAdmins(): Observable<any> {
    return this.http.get(
      `${environment.backendUrl}/admins`,
      { withCredentials: true }
    );
  }

  getAdminById(id: string): Observable<any> {
    return this.http.get(
      `${environment.backendUrl}/admins/${id}`,
      { withCredentials: true }
    );
  }

  updateAdmin(id: string, data: any): Observable<any> {
    return this.http.put(
      `${environment.backendUrl}/admins/${id}`, data,
      { withCredentials: true }
    );
  }

  deleteAdmin(id: string): Observable<any> {
    return this.http.delete(
      `${environment.backendUrl}/admins/${id}`,
      { withCredentials: true }
    );
  }
  login(data: any): Observable<any> {
    return this.http.post(
      `${environment.backendUrl}/login`, data,
      { withCredentials: true }
    );
  }
  logout(): Observable<any> {
    return this.http.get(
      `${environment.backendUrl}/logout`,
      { withCredentials: true }
    );
  }
  //    router.get('/info', verification.getInfo);

  // getInfo(): Observable<any> {
  //   return this.http.get(
  //     `${environment.backendUrl}/info`,
  //     { withCredentials: true }
  //   );
  // }

  verifyToken(): Observable<any> {
    return this.http.get(
      `${environment.backendUrl}/verifyToken`,
      { withCredentials: true }
    );
  }
  verifyAdmin(): Observable<any> {
    return this.http.get(
      `${environment.backendUrl}/verifyAdmin`,
      { withCredentials: true }
    );
  }
  verifyAfiliado(): Observable<any> {
    return this.http.get(
      `${environment.backendUrl}/verifyAfiliado`,
      { withCredentials: true }
    );
  }

//    router.get('/mis-datos', afiliacionController.getMiAfiliacion);
  getMiAfiliacion(): Observable<any> {
    return this.http.get(
      `${environment.backendUrl}/mis-datos`,
      { withCredentials: true }
    );
  }








}

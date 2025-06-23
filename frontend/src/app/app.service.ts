import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/app.environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  createAfiliacion(data: any): Observable<any> {
    
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


  
  getMiAfiliacion(): Observable<any> {
    return this.http.get(
      `${environment.backendUrl}/mis-datos`,
      { withCredentials: true }
    );
  }





  updateAfiliacion(id: string, data: any): Observable<any> {
    return this.http.put(
      `${environment.backendUrl}/afiliaciones/${id}`, data,
      { withCredentials: true }
    );
  }
  getGiros(): Observable<any> {
    return this.http.get(
      `${environment.backendUrl}/giros`,
      { withCredentials: true }
    );
  }


  getSubgiroById(id: string): Observable<any> {
    return this.http.get(
      `${environment.backendUrl}/giros/${id}`,
      { withCredentials: true }
    );
  }
  createGiro(data: any): Observable<any> {
    return this.http.post(
      `${environment.backendUrl}/giros`, data,
      { withCredentials: true }
    );
  }
  updateSubgiro(id: string, data: any): Observable<any> {
    return this.http.put(
      `${environment.backendUrl}/giros/${id}`, data,
      { withCredentials: true }
    );
  }

  getAfiliaciones(): Observable<any> {
    return this.http.get(
      `${environment.backendUrl}/afiliaciones`,
      { withCredentials: true }
    );
  }


  actualizarFechaVencimiento(id: string, data: any): Observable<any> {
    return this.http.put(
      `${environment.backendUrl}/actualizarFechaVencimiento/${id}`, data,
      { withCredentials: true }
    );
  }

  downloadDocumento(id: number, key: string): Observable<Blob> {
    const url = `${environment.backendUrl}/documentos/${id}/${key}`;
    // OJO: Sin genéricos, para que Angular elija el overload que hace xhr.responseType = 'blob'
    return this.http.get(url, {
      responseType: 'blob',
      withCredentials: true
    });
  }

}

import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { switchMap, map, filter } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  baseUrl = environment.apiUrl
  constructor(private socket: Socket, private http: HttpClient) { }

  getMessage() {
    return this.socket.fromEvent('errorEvent').pipe(map((data: any) => data.message));
  }

  getPreviousErrors(filters: any) {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(k => {
      if (filters[k]) {
        httpParams = httpParams.set(k, filters[k]);
      }
    });
    return this.http.get(this.baseUrl + '/errors', { params: httpParams }).pipe(
      map((response) => {
        return response;
      }),
    );
  }
}

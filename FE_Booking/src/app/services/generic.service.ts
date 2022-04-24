import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenericService {
  baseUrl = environment.apiUrl
  constructor( private http: HttpClient) { }


  // getPreviousErrors(filters: any) {
  //   let httpParams = new HttpParams();
  //   Object.keys(filters).forEach(k => {
  //     if (filters[k]) {
  //       httpParams = httpParams.set(k, filters[k]);
  //     }
  //   });
  //   return this.http.get(this.baseUrl + '/errors', { params: httpParams }).pipe(
  //     map((response) => {
  //       return response;
  //     }),
  //   );
  // }

  login(body: any) {
    return this.http.post(this.baseUrl + '/login',body).pipe(
      map((response) => {
        debugger
        return response;
      }),
    );
  }
  signUp(body: any) {
    return this.http.post(this.baseUrl + '/signup',body).pipe(
      map((response) => {
        debugger
        return response;
      }),
    );
  }

  
}

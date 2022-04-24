import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private subject = new ReplaySubject<gapi.auth2.GoogleUser>(1)
  constructor() {
    gapi.load('auth2',() => {
      gapi.auth2.init({
        client_id:environment.GOOGLE_API_CLIENT_ID,
        hosted_domain:'selise.ch'
      })
    })
   }

   public async signIn() {
    var auth2 = gapi.auth2.getAuthInstance();
    let user = await  auth2.signIn()
    localStorage.setItem('user',JSON.stringify(user.isSignedIn()))
    return {
      login:"success"
    }
   }

   public signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
     auth2.signOut().then(() => {
       localStorage.removeItem('user')
     })
   }

   public observable (): Observable<gapi.auth2.GoogleUser> {
     return this.subject.asObservable()
   }
}

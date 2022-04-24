import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GenericService } from 'src/app/services/generic.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  profileForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  constructor(private service:GenericService,private router:Router,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    
  }

  signIn() {
    let value = this.profileForm.getRawValue()
    this.service.login(value).subscribe((res:any) => {
      debugger
      if(res) {
        localStorage.setItem('user',JSON.stringify(res))
        if(res.role === 'admin') {
          this.router.navigate(['/admin'])
        }
        if(res.role === 'appuser') {
          this.router.navigate(['/student'])
        }
      }
    })
    // then((res) => {
    //    this.router.navigate(['/home'])
    // })
  }

  signUp() {
    let value = this.profileForm.getRawValue()
    this.service.signUp(value).subscribe((res:any) => {
      if(res) {
        localStorage.setItem('user',JSON.stringify(res))
        if(res.role === 'admin') {
          this.router.navigate(['/admin'])
        }
        if(res.role === 'appuser') {
          this.router.navigate(['/student'])
        }
      }
      else{
       
      }
    },(error) => {
      console.log(error.error)
      this._snackBar.open(error.error.error);
    })
  }

}

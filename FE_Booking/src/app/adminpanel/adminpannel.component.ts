import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import{HttpClient, HttpHeaders} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from 'uuid';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
const myId = uuid.v4();
const BaseUrl = environment.apiUrl

@Component({
  selector: 'app-adminpannel',
  templateUrl: './adminpannel.component.html',
  styleUrls: ['./adminpannel.component.scss']
})
export class AdminpannelComponent implements OnInit {
  displayedColumns: string[] = ['Date', 'Department', 'Event', 'Reference','Status','Action'];
  id:number;
  length:any;
  isLoading:boolean = false
  Active: boolean[];
  requests = new MatTableDataSource<any>();
  minDate: Date;
  userId: any;
  department: any;
  dateFilter:any;
  dataArray=[];
  dateForm=new FormGroup({
    event:new FormControl(),
    rating:new FormControl(),
  })
  constructor(private http:HttpClient,private _snackBar: MatSnackBar,
    private activatedRouter:ActivatedRoute,private router:Router){}
  ngOnInit(){
     this.getAllRequests()
  }
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  selcteddep(dep:any){
    this.department=dep.value;

  }

  getAllRequests() {
    let user = this.getCurrentUser()
    this.http.post(BaseUrl+'/get/request',user).subscribe((res:any)=>{
       this.requests= res
    })
  }
  
  delete(id:any){
  }
  cancel(){
    this.dateForm.reset()
  }
  fetchData(){
  }

  logOut() {
    this.router.navigate([''])
    localStorage.removeItem('user')
    
  }
  submitdate(){
    let formData = this.dateForm.getRawValue()
    this.http.post(BaseUrl+'/options',formData).subscribe(res=>{
      console.log("res",res);
      this.openSnackBar("Option Created",'')     
    })
    this.dateForm.reset();
  }

  approve(element:any) {
    let obj = {
      id:element.id,
      requeststatus:!element.requeststatus
    }
    this.http.post(BaseUrl+'/update/request',obj).subscribe(res=>{
      this.getAllRequests()
      this.openSnackBar("Status changed",'')     
    })
  }

  
  getCurrentUser() {
    let user = localStorage.getItem('user') || ''
    return JSON.parse(user)
  }

}

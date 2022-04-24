import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import{HttpClient, HttpHeaders} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as uuid from 'uuid';
import { environment } from 'src/environments/environment';
const newId = uuid.v4();
const Baseurl = environment.apiUrl

@Component({
  selector: 'app-studentpannel',
  templateUrl: './studentpannel.component.html',
  styleUrls: ['./studentpannel.component.scss']
})
export class StudentpannelComponent implements OnInit {
  displayedColumns: string[] = ['Date', 'Department', 'Event', 'Reference','Status'];
  dataSource :any [] =[];
  allRequests=[];
  myRequests=[];
  id:number;
  length:any;
  isLoading:boolean = false
  
  allEvents:any [] =[]
  private header=new HttpHeaders({'Content-Type':'application/json'})
  Active: boolean[];
  minDate:Date =new Date();
  userId: any;
  department: any;
  dateFilter:any;
  dataArray=[];
  requests : any [] =[]
  dateForm=new FormGroup({
    id:new FormControl(uuid.v4()),
    name:new FormControl(),
    date:new FormControl(),
    department:new FormControl(),
    reference:new FormControl(),
    event:new FormControl()
  })
  event: any;
  constructor(private http:HttpClient,private _snackBar: MatSnackBar,private router:Router){}
  ngOnInit(){
    this.getAllEvents()
    this.getAllRequests()
  }
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  getAllEvents() {
      this.http.get(Baseurl+'/options').subscribe((res:any) => {
        this.allEvents = res;
      })
  }

  getAllRequests() {
    let user = this.getCurrentUser()
    this.http.post(Baseurl+'/get/request',user).subscribe((res:any)=>{
      this.requests = res     
    })
  }
  selcteddep(dep:any){
    this.department=dep.value;
    debugger;
  }
  onselcteEvent(event:any) {
    this.event = event
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
    let formdata = this.dateForm.getRawValue()
    formdata.user = this.getCurrentUser()
    console.log(formdata)
    this.http.post(Baseurl+'/request',formdata).subscribe(res=>{
      this.getAllRequests()
      this.openSnackBar("Request placed",'')     
    })
    this.dateForm.reset();
  }

  getCurrentUser() {
    let user = localStorage.getItem('user') || ''
    return JSON.parse(user)
  }

}

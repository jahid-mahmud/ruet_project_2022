import { Component, OnInit } from '@angular/core';
import { ErrorService } from './services/error.service';
import { Socket } from 'ngx-socket-io';
import { Errors } from './models/error.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
interface FilterOptions {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  nodes: FilterOptions[] = [
    { value: 'All', viewValue: 'All' },
    { value: 'aks-system2-19210649-vmss000000', viewValue: 'aks-system2-19210649-vmss000000 ' },
    { value: 'aks-usernodes-19210649-vmss000000', viewValue: 'aks-usernodes-19210649-vmss000000' },
    { value: 'aks-usernodes-19210649-vmss000001', viewValue: 'aks-usernodes-19210649-vmss000001' },
    { value: 'aks-usernodes-19210649-vmss000002', viewValue: 'aks-usernodes-19210649-vmss000002' }
  ];

  nameSpaces: FilterOptions[] = [
    { value: 'All', viewValue: 'All' },
    { value: 'dev-pds', viewValue: 'dev-pds' },
    { value: 'kube-system', viewValue: 'kube-system' },
    { value: 'default', viewValue: 'default' }
  ];

  searchForm: FormGroup = new FormGroup({
    namespace: new FormControl('')
  });

  isLoading: boolean = true;
  filters = {
    namespace: '',
    'source.host': ''
  }
  displayedColumns: string[] = ['time', 'namespace', 'name', 'reason', 'source', 'message'];
  dataSource = new MatTableDataSource<Errors>();
  errors: Errors[] = [];
  selectedNameSpace: string;
  selectedNode: string;
  constructor(private service: ErrorService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router) {
    this.service.getMessage().subscribe((res: Errors) => {
      this.dataSource.data = []
      let errorName = res.name || ''
      console.log(res)
      this.errors.unshift(res)
      this.dataSource.data = this.errors
      this.openSnackBar(errorName, 'X')
    })
  }

  ngOnInit(): void {
    this.getRecordedErrors()
    this.subscribeSearchChange()
  }
  subscribeTOInputChange() {
    this.searchForm.controls.namespace.valueChanges.subscribe(res => {
      this.selectedNameSpace = res
      this.getRecordedErrors()
      console.log(res)
    })
  }

  private subscribeSearchChange() {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(1000)
      )
      .subscribe(() => {
        this.selectedNameSpace = this.searchForm.getRawValue().namespace;
        this.getRecordedErrors()
      });
  }

  getRecordedErrors() {
    this.errors = []
    this.isLoading = true
    if (this.selectedNameSpace) {
      this.filters.namespace = this.selectedNameSpace
    }
    if (!this.selectedNameSpace) {
      this.filters.namespace = ''
    }

    if (this.selectedNode) {
      if (this.selectedNode === 'All') this.filters['source.host'] = ''
      else this.filters['source.host'] = this.selectedNode
    }

    this.service.getPreviousErrors(this.filters).subscribe((res: any) => {
      this.isLoading = false
      this.errors.push(...res)
      this.dataSource.data = this.errors
    }, (err) => {
      this.isLoading = false
    })
  }

  onNameSpaceSelected(data: string) {
    this.selectedNameSpace = data
    this.getRecordedErrors()
  }

  onNodeSelected(data: string) {
    this.selectedNode = data
    this.getRecordedErrors()
  }

  openSnackBar(message: string, action: string) {
    if (localStorage.getItem('user')) {
      this._snackBar.open(message, action);
    }
  }

  logOut() {
    this.authService.signOut()
    this.router.navigate(['/'])
  }


}

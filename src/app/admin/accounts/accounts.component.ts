import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { Params } from '@angular/router';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { TableComponent } from './table/table.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent extends BaseComponent implements OnInit {

  isApprovedBy:boolean = false;
  isShowTable:boolean = true;
  status:string = 'new';

  Accounts: AccountGetModel[] = [];

  
  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params:Params) => {
        this.status = params['id']; // console.log(params["id"]);
        this.isShowTable = true;
        if(this.status === 'analytics'||this.status === 'invites'||this.status === 'funding'){
          this.isShowTable = false;
        }
        else if(this.status != 'new'&& this.status != 'all'){
          this.isApprovedBy = true;
        }
        else {
          this.isApprovedBy = false;
        }
      }
    );

    this.getAccounts();
  }

  getAccounts(){
    this.main.adminService.GetAccountsRequests({account_type: 'all',limit:20,offset:0})
      .subscribe((res)=>{
        this.Accounts = res;
      })
  }


}

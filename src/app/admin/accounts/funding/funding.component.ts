import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';

@Component({
  selector: 'app-funding',
  templateUrl: './funding.component.html',
  styleUrls: ['./funding.component.css']
})
export class FundingComponent extends BaseComponent implements OnInit {

  Accounts: any[] = [];
  CheckedAccounts: any[] = [];

  SearchName: string = '';
  AccountsType: string = 'all'

  ngOnInit() {
    this.main.adminService.GetAccountFunding()
      .subscribe(
        (res)=>{
          this.Accounts = res;
          this.CheckedAccounts = this.Accounts;
          // console.log(this.Accounts);
        }
      )
  }

  SearchAccs(event?){
    if(event)
      this.SearchName = event.target.value;

    if(this.SearchName){
      this.SearchName = this.SearchName.toLowerCase();
      if(this.AccountsType==='all'){
        this.CheckedAccounts = this.Accounts.filter(obj => 
          obj.user_name && obj.user_name.toLowerCase().indexOf(this.SearchName)>=0 || 
          obj.last_name && obj.last_name.toLowerCase().indexOf(this.SearchName)>=0 || 
          obj.first_name && obj.first_name.toLowerCase().indexOf(this.SearchName)>=0
        );
      }  
      else{
        this.CheckedAccounts = this.Accounts.filter(obj => 
          obj.user_name && obj.user_name.toLowerCase().indexOf(this.SearchName)>=0 && obj.account_type===this.AccountsType || 
          obj.last_name && obj.last_name.toLowerCase().indexOf(this.SearchName)>=0 && obj.account_type===this.AccountsType || 
          obj.first_name && obj.first_name.toLowerCase().indexOf(this.SearchName)>=0 && obj.account_type===this.AccountsType
        );
      }
    }
    else {
      if(this.AccountsType==='all'){
        this.CheckedAccounts = this.Accounts;
      }
      else{
        this.CheckedAccounts = this.Accounts.filter(obj => obj.account_type===this.AccountsType);
      }
    }
  }

  // no input
    // no input all type - all
    // no input type - type
  // input
    // input all type - input
    // input type - input&&type

}

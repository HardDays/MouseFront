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

  openIds:number[] = [];

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


  openAccount(id:number){
    this.router.navigate(["/admin",'account',id])
  }


  checkIdToOpen(id:number){
    let index = this.openIds.indexOf(id);
    if(index<0)
      this.openIds.push(id);
    else
      this.openIds.splice(index,1);
    
      // console.log(this.openIds);

  }

  openInNewTabs(){
    // let type = this.Accounts?'account':this.Events?'event':'';
    for(let id of this.openIds){
        // window.open('http://localhost:4200/admin/'+type+'/'+id,'_blank');
        window.open('http://mouse-web.herokuapp.com/admin/account/'+id,'_blank');
        window.blur();
      }
  }

  deleteAll(){
    for(let id of this.openIds){
        this.main.adminService.AccountDelete(id)
          .subscribe(
            (res)=>{
              // console.log(id,`ok`);
              this.Accounts.splice(this.Accounts.indexOf(this.Accounts.find((a)=>a.id===id)),1)
            },
            (err)=>{
              // console.log(`err`,err);
            }
          )
      }

  }

  // no input
    // no input all type - all
    // no input type - type
  // input
    // input all type - input
    // input type - input&&type

}

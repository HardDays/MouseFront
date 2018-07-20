import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { Params } from '../../../../../node_modules/@angular/router';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent extends BaseComponent implements OnInit {

  accType = 'fan';
  accId = 0;
  Account:AccountCreateModel = new AccountCreateModel();

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params:Params) => {
        this.accId = params['id']; // console.log(params["id"]);
        this.main.adminService.GetAccountById(this.accId)
          .subscribe(
            (res)=>{
              this.Account = res;
              this.accType = this.Account.account_type;
              console.log(`Acc`,this.Account);
            }
          )
        
      }
    );
  }

  removeAcc(){
    console.log(`removeAcc`);
    this.main.adminService.AccountDelete(this.accId)
      .subscribe(
        (res)=>{
          console.log(`res`,res);
        },
        (err)=>{
          console.log(`err`,err)
        }
      )
  }

  denyAcc(){
    console.log(`denyAcc`);
    this.main.adminService.AccountDeny(this.accId)
      .subscribe(
        (res)=>{
          console.log(`res`,res);
        },
        (err)=>{
          console.log(`err`,err)
        }
      )
  }

  approveAcc(){
    console.log(`approveAcc`);
    this.main.adminService.AccountApprove(this.accId)
      .subscribe(
        (res)=>{
          console.log(`res`,res);
        },
        (err)=>{
          console.log(`err`,err)
        }
      )
  }

}

import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { Params } from '@angular/router';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent extends BaseComponent implements OnInit {

  accType = '';
  accId = 0;
  Account:AccountCreateModel = new AccountCreateModel();

  ngOnInit() {
    window.scrollTo(0,0);
    this.activatedRoute.params.subscribe(
      (params:Params) => {
        this.accId = params['id']; // console.log(params["id"]);
        this.getThisAcc();
      }
    );
  }

  getThisAcc(){
    this.main.adminService.GetAccountById(this.accId)
    .subscribe(
      (res)=>{
        this.Account = res;
        this.accType = this.Account.account_type;
        // console.log(`Acc`,this.Account);
      },
      (err)=>{
        console.log(`err`,err)
      }
    )
  }

  removeAcc(){
    // console.log(`removeAcc`);
    this.main.adminService.AccountDelete(this.accId)
      .subscribe(
        (res)=>{
          // console.log(`res`,res);
          this.router.navigate(['/admin','accounts','all'])
        },
        (err)=>{
          console.log(`err`,err)
        }
      )
  }

  denyAcc(){
    // console.log(`denyAcc`);
    this.main.adminService.AccountDeny(this.accId)
      .subscribe(
        (res)=>{
          console.log(`res`,res);
          this.getThisAcc();
        },
        (err)=>{
          console.log(`err`,err)
        }
      )
  }

  approveAcc(){
    // console.log(`approveAcc`);
    this.main.adminService.AccountApprove(this.accId)
      .subscribe(
        (res)=>{
          console.log(`res`,res);
          this.getThisAcc();
        },
        (err)=>{
          console.log(`err`,err)
        }
      )
  }

}

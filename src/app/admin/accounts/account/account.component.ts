import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { Params } from '@angular/router';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';
import { ErrorComponent } from '../../../shared/error/error.component';
import { BaseMessages } from '../../../core/base/base.enum';
import { CurrencyIcons } from '../../../core/models/preferences.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent extends BaseComponent implements OnInit {

  accType = '';
  accId = 0;
  Account:AccountCreateModel = new AccountCreateModel();

  CurrencySymbol = '$';

  @ViewChild('errCmp') errCmp: ErrorComponent = new ErrorComponent(this.translate, this.settings);

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
         this.CurrencySymbol = CurrencyIcons[this.Account.currency];
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
          this.errCmp.OpenWindow('Success');
          // this.getThisAcc();
           this.Account.status = 'denied';
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
          this.errCmp.OpenWindow('Success');
          // this.getThisAcc();
          this.Account.status = 'approved';
        },
        (err)=>{
          console.log(`err`,err)
        }
      )
  }

  openError(error:string){
     this.errCmp.OpenWindow(error);
  }

  checkAcc(){
     this.main.adminService.AccountView(this.accId)
      .subscribe(res => {
        setTimeout(() => {
          this.main.adminService.NewCountChange.next(true);
        }, 300);
        this.Account.status = 'pending';
      });
  }



}

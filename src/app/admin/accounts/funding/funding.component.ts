import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';

@Component({
  selector: 'app-funding',
  templateUrl: './funding.component.html',
  styleUrls: ['./funding.component.css']
})
export class FundingComponent extends BaseComponent implements OnInit {

  Accounts: any[] = [];

  ngOnInit() {
    this.main.adminService.GetAccountFunding()
      .subscribe(
        (res)=>{
          this.Accounts = res;
          // console.log(this.Accounts);
        }
      )
  }

}

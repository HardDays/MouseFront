import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { EventGetModel } from '../../core/models/eventGet.model';
import { CheckModel } from '../../core/models/check.model';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  Counts = {fan:0, artist:0, venue:0};
  Accounts: CheckModel<AccountGetModel>[] = [];
  Events:CheckModel<any>[] = [];

  ngOnInit() {
    this.GetInfo();
  }

  GetInfo(){
    this.main.adminService.GetAccountsNew()
    .subscribe(
      (res)=>{
        this.Counts = res;
      }
    )

    this.main.adminService.GetAccountsRequests()
      .subscribe(
        (res)=>{
          this.Accounts = this.convertArrToCheckModel<any>(res);
          //  console.log(this.Accounts);
        }
      )

    this.main.adminService.GetEventsRequests()
      .subscribe(
        (res)=>{
          this.Events = this.convertArrToCheckModel<any>(res);
          //  console.log(res);
        }
      )
  }

  openTabsAcc(){
    for(let acc of this.Accounts){
      if(acc.checked){
        // window.open('http://localhost:4200/admin/account/'+acc.object.id,'_blank');
        window.open('http://mouse-web.herokuapp.com/admin/account/'+acc.object.id,'_blank');
        window.blur();
      }
    }
  }

  openTabsEvent(){
    for(let event of this.Events){
      if(event.checked){
        // window.open('http://localhost:4200/admin/event/'+event.object.id,'_blank');
        window.open('http://mouse-web.herokuapp.com/admin/event/'+event.object.id,'_blank');
        window.blur();
      }
    }
  }

}

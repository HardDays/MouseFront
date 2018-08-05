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
  ScrollArtistDisabled = true;
  ScrollEventsDisabled = true;

  ngOnInit() {
    this.GetInfo();
  }

  GetInfo(){
    if(this.MyUser.is_admin||this.MyUser.is_superuser){
      this.main.adminService.GetAccountsNew()
        .subscribe(
          (res)=>{
            this.Counts = res;
          }
        )

      this.main.adminService.GetAccountsRequests({account_type: 'all',limit:20,offset:0})
        .subscribe(
          (res)=>{
            this.Accounts = this.convertArrToCheckModel<any>(res);
            setTimeout(() => {
              this.ScrollArtistDisabled = false;
            }, 200);
          }
        )

      this.main.adminService.GetEventsRequests({limit:20,offset:0})
        .subscribe(
          (res)=>{
            this.Events = this.convertArrToCheckModel<any>(res);
            //  console.log(res);
            setTimeout(() => {
              this.ScrollEventsDisabled = false;
            }, 200);
          }
        )
    }
  }

  onScrollArtist(){
    this.ScrollArtistDisabled = true;
    this.main.adminService.GetAccountsRequests({account_type: 'all',limit:20,offset:this.Accounts.length})
      .subscribe(
        (res)=>{
          this.Accounts.push(...this.convertArrToCheckModel<any>(res));
          setTimeout(() => {
            this.ScrollArtistDisabled = false;
          }, 200);
        }
      )
  }

  onScrollEvent(){
    this.ScrollEventsDisabled = true;
    this.main.adminService.GetEventsRequests({limit:20,offset:this.Events.length})
      .subscribe(
        (res)=>{
          this.Events.push(...this.convertArrToCheckModel<any>(res));
          //  console.log(res);
          setTimeout(() => {
            this.ScrollEventsDisabled = false;
          }, 200);
        }
      )
  }

  openTabsAcc(){
    for(let acc of this.Accounts){
      if(acc.checked){
        // window.open( window.location.origin + '/admin/account/'+acc.object.id,'_blank');
        window.open('http://mouse-web.herokuapp.com/admin/account/'+acc.object.id,'_blank');
        window.blur();
      }
    }
  }

  openTabsEvent(){
    for(let event of this.Events){
      if(event.checked){
        // window.open(window.location.origin + '/admin/event/'+event.object.id,'_blank');
        window.open('http://mouse-web.herokuapp.com/admin/event/'+event.object.id,'_blank');
        window.blur();
      }
    }
  }

  deleteAccs(){
    for(let acc of this.Accounts){
      if(acc.checked){
        this.main.adminService.AccountDelete(acc.object.id)
          .subscribe(
            (res)=>{
              console.log(acc.object.id,`ok`);
              this.Accounts.splice(this.Accounts.indexOf(acc),1)
            },
            (err)=>{
              console.log(`err`,err)
            }
          )
      }
    }
  }

  deleteEvents(){
    for(let events of this.Events){
      if(events.checked){
        this.main.adminService.EventDelete(events.object.id)
          .subscribe(
            (res)=>{
              console.log(events.object.id,`ok`);
              this.Events.splice(this.Events.indexOf(events),1)
            },
            (err)=>{
              console.log(`err`,err)
            }
          )
      }
    }
  }


}

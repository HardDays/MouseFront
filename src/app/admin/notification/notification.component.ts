import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
declare var $:any;
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent extends BaseComponent implements OnInit {

  Feed:any;

  ForwardMessage = {
    id: 0,
    topic: '',
    receiver_id: 0
  }

  AdminsList:{id:number,user_name:string}[] = [];

  ngOnInit() {
    this.getNotification();
  }

  getNotification(){
    this.main.adminService.GetFeed()
      .subscribe((res)=>{
        this.Feed = res;
        console.log(this.Feed);
      })
  }

  openForward(id:number){
    this.ForwardMessage.id = id;
    this.getAdminsList();
    $('#forward').modal('show');
  }

  getAdminsList(){
    this.main.adminService.GetAdminsList()
          .subscribe(
            (res)=>{
              this.AdminsList = res;
            }
          )
  }
  sendForward(adminId:number){
    this.ForwardMessage.receiver_id = adminId;
     $('#forward').modal('hide');
     console.log(this.ForwardMessage);
  }


}

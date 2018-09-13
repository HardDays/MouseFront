import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent extends BaseComponent implements OnInit {

  Feed:any;
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


}

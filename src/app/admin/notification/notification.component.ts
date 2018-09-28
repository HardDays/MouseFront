import { BaseImages } from './../../core/base/base.enum';
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

  AdminsList:{id:number,user_name:string,image_id:number,image:string}[] = [];

  ngOnInit() {
    this.getNotification();
  }

  getNotification(){
    this.main.adminService.GetFeed()
      .subscribe((res)=>{
        this.Feed = res;
        // console.log(this.Feed);
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
              for(let item of this.AdminsList){
                if(item.image_id){
                  item.image = this.main.imagesService.GetImagePreview(item.image_id,{width:220,height:220})
                }
                else{
                  item.image = BaseImages.NoneFolowerImage;
                }
              }
            }
          )
  }
  sendForward(adminId:number){
    this.ForwardMessage.receiver_id = adminId;
     this.main.adminService.FeedbackForward( this.ForwardMessage.id, this.ForwardMessage.receiver_id, this.ForwardMessage.topic)
      .subscribe(
        (res)=>{
          $('#forward').modal('hide');
          this.ForwardMessage.topic = '';
          // console.log(`ok`);
        }
      )
  }


}

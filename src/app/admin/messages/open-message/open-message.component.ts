import { EventEmitter, ViewChild } from '@angular/core';
import { BaseImages } from './../../../core/base/base.enum';
import { BaseComponent } from './../../../core/base/base.component';
import { Component, OnInit, Input, SimpleChanges, Output } from '@angular/core';

interface Message{
  id:number,
  created_at:string,
  forwarded_from:{
    user_name:string
  }
  forwarded_message:string,
  is_read:boolean,
  message:string,
  receiver_deleted:boolean,
  sender_deleted:boolean,
  sender_id:number,
  topic_id:number,
  image:string
}

@Component({
  selector: 'app-open-message',
  templateUrl: './open-message.component.html',
  styleUrls: ['./open-message.component.css']
})
export class OpenMessageComponent extends BaseComponent implements OnInit {

  @Input() Dialog:any;
  User:any;
  DialogId = 0;
  Messages:{messages:Message[], date:string}[] = [];
  Answer = '';

  idOpenMenu = 0;
  // constructor() { }

  @Output() onSolved = new EventEmitter<boolean>();
  @Output() onDelete = new EventEmitter<boolean>();
  @Output() onForward = new EventEmitter<boolean>();

  //   created_at: "2018-09-13T14:46:46.364Z"
  // forwarded_from: {user_name: "rediska"}
  // forwarded_message: ""
  // id: 35
  // is_read: true
  // message: "test is forwared"
  // receiver_deleted: false
  // sender_deleted: false
  // sender_id: 10
  // topic_id: 36
  // updated_at: "2018-09-13T14:46:46.364Z"

  ngOnInit() {
    this.main.adminService.GetMyAccByIdUser(this.main.MyUser.id)
        .subscribe((res)=>{
          this.User = res;
          if(this.User.image_id)
            this.User.image = this.main.imagesService.GetImagePreview(this.User.image_id,{width:120, height:120});
          else
            this.User.image = BaseImages.NoneFolowerImage;
        });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.Dialog){
      this.Dialog = changes.Dialog.currentValue;
      // console.log(`dialog`,this.Dialog);
      if(this.Dialog&&this.Dialog.id){
        this.DialogId = this.Dialog.id;
        this.openMessage();
      }
    }
  }

  openMessage(){
    if(this.DialogId){
      this.idOpenMenu = 0;
      this.main.adminService.GetMessagesById(this.DialogId)
        .subscribe((res)=>{
          this.GroupMessagesByDate(res);
        })
    }
  }

  GroupMessagesByDate(messages:Message[]){
    this.Messages = [];
    for(let item of messages){
      let date = new Date(item.created_at).toDateString();
      let find = this.Messages.findIndex(obj=>obj.date === date);
      if(find>=0){
        this.Messages[find].messages.push(item);
      }
      else{
        let msgs:Message[] = []; msgs.push(item);
        this.Messages.push({date,messages:msgs});
      }
    }
    // console.log(this.Messages);
  }

  sendMessage(){
    if(this.Answer.length>0){
      this.main.adminService.SendMessage(this.Dialog.id,this.User.id,this.Answer)
        .subscribe(
          (res)=>{
            this.Answer = '';
            // console.log(`res ok`,res);
            this.openMessage();
          }
      )
    }
  }

  solvedMessage(){
    this.main.adminService.SolveMessage(this.Dialog.id)
      .subscribe(
        (res)=>{
          // console.log(`solved ok!`);
          this.onSolved.emit(true);
        }
      )
  }

  forwardMessage(){
    // console.log(`forward`);
    this.main.adminService.ForwardMessage(this.idOpenMenu,this.Dialog.receiver_id)
      .subscribe((res)=>{
        // console.log(`message forward`);
        // this.openMessage();
        this.onForward.emit(true);
      })
  }

  deleteMessage(){
    // console.log(`delete`);
    this.main.adminService.DeleteMessage(this.DialogId,this.idOpenMenu)
      .subscribe((res)=>{
        // console.log(`message delete`);
        this.openMessage();
      })
  }

  deleteDialog(){
    this.main.adminService.DeleteDialog(this.Dialog.id)
      .subscribe((res)=>{
        // console.log(`dialog delete`);4
        this.onDelete.emit(true);

      })
  }

}

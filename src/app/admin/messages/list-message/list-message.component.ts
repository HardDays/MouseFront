import { AccountGetModel } from './../../../core/models/accountGet.model';
import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';

interface Message {
  created_at:string,
  id:number,
  is_solved:boolean,
  is_read:boolean,
  topic:string,
  topic_type:string,
  receiver_id:number,
  sender_id:number,
  sender:AccountGetModel,
  receiver:AccountGetModel
}

@Component({
  selector: 'app-list-message',
  templateUrl: './list-message.component.html',
  styleUrls: ['./list-message.component.css']
})
export class ListMessageComponent extends BaseComponent implements OnInit {

  Messages:Message[] = [];
  openMessage:Message;

  @Input() isNewMessageOpened = false;
  @Output() onClickMessage = new EventEmitter<number>();

  ngOnInit() {
    this.getMessages();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if(changes.isNewMessageOpened){
  //     this.isNewMessageOpened = changes.isNewMessageOpened.currentValue;
  //   }
  // }

  getMessages(){
    this.main.adminService.GetMessages()
      .subscribe(
        (res)=>{
          this.Messages = res;
          if(this.Messages.length>0){
            this.openMessage = this.Messages[0];
            this.onClickMessage.emit(this.openMessage.id);
          }
          console.log(this.Messages);
        })
  }

  clickMessage(message){
    this.openMessage = message;
    this.readMessage();
    this.onClickMessage.emit(this.openMessage.id);
  }

  readMessage(){
    if(!this.openMessage.is_read)
      this.main.adminService.ReadMessage(this.openMessage.id)
        .subscribe(
          (res)=>{
            console.log(`ok`);
            this.openMessage.is_read = true;
          }
        )
  }

}

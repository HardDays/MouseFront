import { BaseImages } from './../../../core/base/base.enum';
import { AccountGetModel } from './../../../core/models/accountGet.model';
import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';

interface Message {
  created_at:string,
  id:number,
  is_solved:boolean,
  is_forwarded:boolean,
  is_read:boolean,
  topic:string,
  topic_type:string,
  receiver_id:number,
  sender_id:number,
  sender:AccountGetModel,
  receiver:AccountGetModel,
  with:{
    first_name:string,
    last_name:string,
    user_name:string,
    image_id:number,
    image:string
  }
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
  @Output() onClickMessage = new EventEmitter<Message>();

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
            this.onClickMessage.emit(this.openMessage);
            this.getImages();
          }
          console.log(this.Messages);
        })
  }

  setSolved(idMessage:number){
    this.Messages.find(obj=>obj.id===idMessage).is_solved = true;
  }

  clickMessage(message){
    this.openMessage = message;
    this.readMessage();
    this.onClickMessage.emit(this.openMessage);
  }

  getImages(){
    for(let item of this.Messages){
      if(item.with.image_id)
        item.with.image = this.main.imagesService.GetImagePreview(item.with.image_id,{width:120,height:120});
      else
        item.with.image = BaseImages.NoneFolowerImage;
    }
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

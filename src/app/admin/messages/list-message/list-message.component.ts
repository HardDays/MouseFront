import { AccountGetModel } from './../../../core/models/accountGet.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';

interface Message {
  created_at:string,
  id:number,
  is_solved:boolean,
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

  @Output() onClickMessage = new EventEmitter();

  ngOnInit() {
    this.getMessages();
  }

  getMessages(){
    this.main.adminService.GetMessages()
      .subscribe(
        (res)=>{
          this.Messages = res;
          console.log(this.Messages);
        })
  }

}

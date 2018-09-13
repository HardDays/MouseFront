import { Component, OnInit, ViewChild } from '@angular/core';
import { ListMessageComponent } from './list-message/list-message.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  @ViewChild('ListMessage') ListMessage:ListMessageComponent;
  IsNewMsgOpen = false;
  Message:any;
  constructor() { }

  ngOnInit() {
  }

  openNewMessage(){
    this.IsNewMsgOpen = !this.IsNewMsgOpen;
  }

  openMessage(event){
    this.Message = event;
  }

  setSolved(){
    this.Message.is_solved = true;
    this.ListMessage.setSolved(this.Message.id);
  }

}

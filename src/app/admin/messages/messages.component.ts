import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  IsNewMsgOpen = false;
  MessageId:number = 0;
  constructor() { }

  ngOnInit() {
  }

  openNewMessage(){
    this.IsNewMsgOpen = !this.IsNewMsgOpen;
  }

  openMessage(event){
    this.MessageId = event;
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  IsNewMsgOpen = false;
  constructor() { }

  ngOnInit() {
  }

  openNewMessage(){
    this.IsNewMsgOpen = !this.IsNewMsgOpen;
  }

  openMessage(event){
    console.log(event);
  }

}

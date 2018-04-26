import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { InboxMessageModel } from '../../core/models/inboxMessage.model';

declare var $:any;

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent extends BaseComponent implements OnInit {

  accountId:number;

  messages:InboxMessageModel[] = [];

  isEditShow:boolean = false;
  isEditPrice:boolean = false;

  ngOnInit() {
    this.GetMessages();
   
  }

  GetMessages(){
      this.accService.GetMyAccount({extended:true})
      .subscribe((users:any[])=>{
          for(let u of users)
          if(u.id==+localStorage.getItem('activeUserId')){
            this.accountId = u.id;
            this.accService.GetInboxMessages(this.accountId)
            .subscribe((res:InboxMessageModel[])=>{
              for(let m of res){
                this.accService.GetInboxMessageById(this.accountId,m.id).
                  subscribe((info)=>{
                    console.log(`info`,info);
                    this.messages.push(info);
                  })
              }
            })
          }
      });
  }


}

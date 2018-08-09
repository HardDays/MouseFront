import { Component, OnInit, Input } from '@angular/core';
import { InboxMessageModel } from '../../../core/models/inboxMessage.model';
import { BaseComponent } from '../../../core/base/base.component';


@Component({
  selector: 'app-message-support',
  templateUrl: './message-support.component.html',
  styleUrls: ['./message-support.component.css']
})
export class MessageSupportComponent extends BaseComponent implements OnInit {

  @Input() Message:InboxMessageModel = new InboxMessageModel();
  @Input() AccId:number = 0;

  ReplyText: string = '';

  ngOnInit() {
  }

  sendReply(){
    if(this.ReplyText){
      this.main.questService.ReplyQuestion(this.Message.id,this.Message.subject,this.ReplyText,this.AccId)
        .subscribe(
          (res)=>{
            console.log(`ok`);
            this.ReplyText = '';
          }
        )
    }
    else {
      console.log(`Error`);
    }
  }

}

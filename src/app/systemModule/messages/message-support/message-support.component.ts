import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
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
    //this.openFullMessage();
    // console.log(this.Message);
  }

  // ngOnChanges(change:SimpleChanges){
  //   if(change.Message){
  //     this.Message = change.Message.currentValue;
  //     //this.openFullMessage();
  //   }
  // }



  sendReply(){
    if(this.ReplyText){
      this.main.questService.ReplyQuestion(this.Message.reply[this.Message.reply.length-1].id,this.Message.subject,this.ReplyText,this.AccId)
        .subscribe(
          (res)=>{
            // console.log(`ok`);
            this.ReplyText = '';
          }
        )
    }
    else {
      // console.log(`Error`);
    }
  }

}

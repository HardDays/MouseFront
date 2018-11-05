import { BaseComponent } from './../../../core/base/base.component';
import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { InboxMessageModel } from '../../../core/models/inboxMessage.model';
import { CurrencyIcons } from '../../../core/models/preferences.model';
import { BaseImages } from '../../../core/base/base.enum';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent extends BaseComponent implements OnInit {

  @Input() accountId = 0;
  @Input() selectedId = 0;

  CurrentCurrency = '$';
  messages:InboxMessageModel[] = [];

  @Output() onGetMessages = new EventEmitter<number>();
  @Output() onChangeSelectMessage = new EventEmitter<{id:number, message_type:string}>();

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.accountId){
      this.accountId = changes.accountId.currentValue;
      this.GetMessages();
    }
  }

  GetMessages(){

    this.CurrentCurrency = CurrencyIcons[this.main.settings.GetCurrency()];

    this.messages = [];

    if(this.accountId)
    this.WaitBeforeLoading(
      () => this.main.accService.GetInboxMessages(this.accountId),
      (res:InboxMessageModel[])=>{
        this.messages = res;

        // console.log(`messages`,this.messages);

        this.onGetMessages.emit(res.length);
        // console.log(res);
        for(let m of this.messages){
          if(m.sender){
            if(m.sender.image_id){
              m.sender.image_base64 = this.main.imagesService.GetImagePreview(m.sender.image_id,{width:140,height:140});
            }
            else{
              m.sender.image_base64 = './../'+BaseImages.NoneFolowerImage;
            }
          }
        }
        if(this.messages.length>0){
          if(this.selectedId===0){
            this.selectedId = this.messages[0].id;
            this.changeItem(this.messages[0]);
          }
        }
        // if(this.messages.length>0){
        //   // console.log(`1111`);
        //   // if(this.messages[0].message_type ==='blank'){
        //     // this.openMessage = null;
        //     this.main.accService.GetInboxMessageById(this.accountId,this.messages[0].id)
        //       .subscribe((res)=>{
        //         // console.log(res);
        //         this.openMessage = res;


        //          if(!this.openMessage.is_receiver_read){
        //           this.main.accService.ReadMessageById(this.accountId,this.messages[0].id)
        //             .subscribe((res)=>{
        //               this.main.accService.onMessagesChange$.next(true);
        //               this.openMessage.is_receiver_read = true;
        //               this.messages.find(obj=>obj.id === this.openMessage.id).is_receiver_read = true;
        //             })
        //         }

        //         this.openMessage.reply.unshift({
        //           created_at: this.openMessage.created_at,
        //           id:this.openMessage.id,
        //           message:this.openMessage.message,
        //           message_type:this.openMessage.message_type,
        //           sender: this.openMessage.sender,
        //           sender_id:this.openMessage.sender_id,
        //           subject:this.openMessage.subject
        //           }
        //         )


        //         for(let m of this.openMessage.reply){
        //           if(m.sender&&m.sender.image_id)
        //             m.sender.image_base64 = this.main.imagesService.GetImagePreview(m.sender.image_id,{width:140,height:140});
        //           else
        //             m.sender.image_base64 = BaseImages.NoneFolowerImage;
        //         }
        //         this.idCurMsg = res.id;
        //         this.setDateRange();
        //       })
        //   // }
        //   // else{
        //   //   this.openMessage = this.messages[0];
        //   //   this.idCurMsg = this.messages[0].id;
        //   //   //this.openFullMessage();
        //   //   this.setDateRange();
        //   // }
        // }
        // let index = 0;
        // for(let m of res)
        // {
        //   this.WaitBeforeLoading(
        //     () => this.main.accService.GetInboxMessageById(this.accountId,m.id),
        //     (info:InboxMessageModel)=>{
        //       this.messages.push(info);
        //       //this.getUser(info.sender_id,index);
        //       index = index + 1;
        //     }
        //   );
        // }

      });
  }

  changeItem(message:InboxMessageModel)
  {
    let isExpired = message.message_info&&message.message_info.status&&message.message_info.status === 'time_expired'? true : false;
    if(!isExpired){
      this.onChangeSelectMessage.emit({
        id: message.id,
        message_type: message.message_type
      });
    }
  }

}

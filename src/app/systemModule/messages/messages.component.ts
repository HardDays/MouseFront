import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { InboxMessageModel } from '../../core/models/inboxMessage.model';
import { AccountAddToEventModel } from '../../core/models/artistAddToEvent.model';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';

declare var $:any;

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent extends BaseComponent implements OnInit {

  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  minDate = new Date();
  bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-red' });;

  accountId:number;

 
  openMessage:InboxMessageModel = new InboxMessageModel();
  idCurMsg:number = 0;
  

  isEditShow:boolean = false;
  isEditPrice:boolean = false;

  changePrice:number = 0;
  request:AccountAddToEventModel = new AccountAddToEventModel();
  
  messages:InboxMessageModel[] = [];
  

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
                    if(this.messages.length==1){
                      this.idCurMsg = this.messages[0].id;
                      this.openMessage = this.messages[0];
                     
                      this.setDateRange();
                    
                    }
                  })
              }
              
            })
          }
      });
  }

  getExpireDate(d:string, frame:string){
    let date = new Date(d),
        timeFrame = frame;
   
    let endDate = new Date(date);
    
    
    if(timeFrame == 'one_week'){
      endDate.setDate(endDate.getDate()+7);
    }    
    else if(timeFrame == 'two_hours'){
      endDate.setHours(endDate.getHours()+2)
    }   
    else if(timeFrame == 'two_days'){
      endDate.setDate(endDate.getDate()+2);
    }
     
    
    return endDate;

  }

  isExpiresSoon(date:string, frame:string){
    let expire = this.getExpireDate(date,frame);
    let today = new Date();
    // if(today>expire)
    //   return 'in_past';
    // else {
      today.setDate(today.getDate()+1);
      if(today > expire)
      return 'soon';
    // }

    // return 'in_future';

   


  }

  setDateRange(){
    if(this.openMessage.message_info.event_info.event_season=='spring'){
      this.minDate = new Date(+this.openMessage.message_info.event_info.event_year,2,1);
      this.maxDate = new Date(+this.openMessage.message_info.event_info.event_year,4,31);
    }
    else if(this.openMessage.message_info.event_info.event_season=='summer'){
      this.minDate = new Date(+this.openMessage.message_info.event_info.event_year,5,1);
      this.maxDate = new Date(+this.openMessage.message_info.event_info.event_year,7,31);
    }
    else if(this.openMessage.message_info.event_info.event_season=='autumn'){
      this.minDate = new Date(+this.openMessage.message_info.event_info.event_year,8,1);
      this.maxDate = new Date(+this.openMessage.message_info.event_info.event_year,9,31);
    }
    else if(this.openMessage.message_info.event_info.event_season=='autumn'){
      this.minDate = new Date(+this.openMessage.message_info.event_info.event_year,8,1);
      this.maxDate = new Date(+this.openMessage.message_info.event_info.event_year,10,31);
    }
    else {
      this.minDate = new Date(+this.openMessage.message_info.event_info.event_year,11,1);
      this.maxDate = new Date((+this.openMessage.message_info.event_info.event_year)+1,0,31);
    }
    this.bsRangeValue = [this.minDate, this.maxDate];
  }

  acceptRequest(){
    if(!this.changePrice)
      this.changePrice = this.openMessage.message_info.estimated_price;

    console.log(this.bsRangeValue, +this.changePrice);
  }


}

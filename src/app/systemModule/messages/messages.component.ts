import { Component, OnInit, NgZone, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { InboxMessageModel } from '../../core/models/inboxMessage.model';
import { AccountAddToEventModel } from '../../core/models/artistAddToEvent.model';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { AccountSendRequestModel } from '../../core/models/accountSendRequest.model';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { MainService } from '../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { BaseImages } from '../../core/base/base.enum';

declare var $:any;

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent extends BaseComponent implements OnInit,AfterViewChecked {

  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  minDate = new Date();
  bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-default' });;

  accountId:number;
  type:string;
 
  openMessage:InboxMessageModel = new InboxMessageModel();
  idCurMsg:number = 0;
  

  isEditShow:boolean = false;
  isEditPrice:boolean = false;

  changePrice:number = 0;
  request:AccountSendRequestModel = new AccountSendRequestModel();
  
  messages:InboxMessageModel[] = [];
  
  accs:AccountGetModel[] = [];
  accOpen:AccountGetModel = new AccountGetModel();

  constructor(
    protected main           : MainService,
    protected _sanitizer     : DomSanitizer,
    protected router         : Router,
    protected mapsAPILoader  : MapsAPILoader,
    protected ngZone         : NgZone,
    protected activatedRoute : ActivatedRoute,
    protected cdRef          : ChangeDetectorRef
  ) {
    super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute);
  }
  
  ngOnInit() 
  {
    this.accountId = this.main.CurrentAccount.id;
    this.type = this.main.CurrentAccount.account_type;
    this.GetMessages();

    this.main.MyAccountsChange.subscribe(
      (acc)=>{
        console.log(acc);
        if(acc){
          this.accountId = this.main.CurrentAccount.id;
          this.type = this.main.CurrentAccount.account_type;
          this.GetMessages();
        }
      }
    )
    // this.GetMessages();
  }

  ngAfterViewChecked()
  {
      this.cdRef.detectChanges();

      setTimeout(() => {
        if($(window).width() >= 768){
          $('.rotate-xs-wrapper').css({
            'max-height': 'auto'
          });
          $(window).resize(function(){
              $('.rotate-xs-wrapper').css({
                  'max-height': 'auto'
              });
          });
        }
        else{
          $('.rotate-xs-wrapper').css({
            'max-height': ($('.left-s').width()) +'px'
          });
          $(window).resize(function(){
              $('.rotate-xs-wrapper').css({
                  'max-height': ($('.left-s').width())+'px'
              });
          });
        }
      }, 2000);
  
  
  
  }

  GetMessages(){
    this.messages = [];

   

    this.WaitBeforeLoading(
      () => this.main.accService.GetInboxMessages(this.accountId),
      (res:InboxMessageModel[])=>{
        this.messages = res;
        console.log(res);
        for(let m of this.messages){
          if(m.sender){
            if(m.sender.image_id){
              m.sender.image_base64 = this.main.imagesService.GetImagePreview(m.sender.image_id,{width:140,height:140});
            }
            else{
              m.sender.image_base64 = BaseImages.NoneFolowerImage;
            }
          }
        }
        if(this.messages.length>0){
          this.openMessage = this.messages[0];
          this.idCurMsg = this.messages[0].id;
          this.setDateRange();  
        }
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

  // getUser(sender:number, index:number){
  //   this.WaitBeforeLoading(
  //     () => this.main.accService.GetAccountById(sender,{extended:true}),
  //     (acc)=>{
  //       this.accs[index] = acc;
  //       if(this.accs[index].image_id)
  //       {
  //         this.WaitBeforeLoading(
  //           () => this.main.imagesService.GetImageById(this.accs[index].image_id),
  //           (img)=>{
  //             this.accs[index].image_base64_not_given = img.base64;
  //             //  console.log(`acc`,this.accs,this.accOpen);
  //             if(index==0){
  //               this.idCurMsg = this.messages[0].id;
  //               this.openMessage = this.messages[0];
  //               this.accOpen =  this.accs[0];
  //               this.setDateRange();          
  //             }
  //           }
  //         );
  //       }
  //       else if(index==0)
  //       {
  //         this.idCurMsg = this.messages[0].id;
  //         this.openMessage = this.messages[0];
  //         this.accOpen =  this.accs[0];
  //         this.setDateRange();          
  //       }
  //     }
  //   );
  // }

  changeItem(msg:InboxMessageModel,i:number)
  {
    this.openMessage = msg;
    this.idCurMsg = msg.id;
    this.accOpen =  this.accs[i];
    if( this.openMessage.message_type!='blank')
    this.setDateRange();
  }

  getExpireDate(d:string, frame:string)
  {
    let date = new Date(d),
        timeFrame = frame;
   
    let endDate = new Date(date);
    
    if(timeFrame == 'one_week')
    {
      endDate.setDate(endDate.getDate()+7);
    }    
    else if(timeFrame == 'one_hour')
    {
      endDate.setHours(endDate.getHours()+1)
    }   
    else if(timeFrame == 'one_day')
    {
      endDate.setDate(endDate.getDate()+1);
    }
    else if(timeFrame == 'one_month')
    {
      endDate.setDate(endDate.getDate()+31);
    }
     
    return endDate;

  }

  isExpiresSoon(date:string, frame:string)
  {
    let expire = this.getExpireDate(date,frame);
    let today = new Date();
      today.setDate(today.getDate()+1);
      if(today > expire)
      return 'soon';
  }

  setDateRange()
  {
    if(this.openMessage&&this.openMessage.message_info&&this.openMessage.message_info.event_info&&this.openMessage.message_info.event_info.event_season){
      if(this.openMessage.message_info.event_info.event_season=='spring')
      {
        this.minDate = new Date(+this.openMessage.message_info.event_info.event_year,2,1);
        this.maxDate = new Date(+this.openMessage.message_info.event_info.event_year,5,31);
      }
      else if(this.openMessage.message_info.event_info.event_season=='summer')
      {
        this.minDate = new Date(+this.openMessage.message_info.event_info.event_year,5,1);
        this.maxDate = new Date(+this.openMessage.message_info.event_info.event_year,7,31);
      }
      else if(this.openMessage.message_info.event_info.event_season=='autumn')
      {
        this.minDate = new Date(+this.openMessage.message_info.event_info.event_year,8,1);
        this.maxDate = new Date(+this.openMessage.message_info.event_info.event_year,10,30);
      }
      else if(this.openMessage.message_info.event_info.event_season=='winter')
      {
        this.minDate = new Date(+this.openMessage.message_info.event_info.event_year,11,1);
        this.maxDate = new Date((+this.openMessage.message_info.event_info.event_year)+1,1,31);
      }
      else
      {
        this.minDate = new Date(+this.openMessage.message_info.event_info.event_year,0,1);
        this.maxDate = new Date((+this.openMessage.message_info.event_info.event_year),11,31);
      }
      this.bsRangeValue = [this.minDate, this.maxDate];
    }
  }

  acceptRequest()
  {
    if(!this.changePrice)
      this.changePrice = this.openMessage.message_info.estimated_price;

    this.request.event_id = this.openMessage.message_info.event_info.id;
    this.request.id = this.accountId;
    this.request.message_id = this.openMessage.id;
    this.request.price = +this.changePrice;
    this.request.preferred_date_from = this.bsRangeValue[0];
    this.request.preferred_date_to = this.bsRangeValue[1];

    if(this.type=="artist"){
      this.WaitBeforeLoading(
        () => this.main.eventService.ArtistAcceptedByArtist(this.request),
        (res)=>{
          this.GetMessages();
        }
      );
    }
    else if(this.type=="venue")
    {
      this.WaitBeforeLoading(
        () => this.main.eventService.VenueAcceptedByVenue(this.request),
        (res)=>{
          this.GetMessages();
        }
      );
    }
  }

  declineRequest(){
    
    this.request.event_id = this.openMessage.message_info.event_info.id;
    this.request.id = this.accountId;
    this.request.message_id = this.openMessage.id;

    // console.log(this.request);

    this.WaitBeforeLoading(
      () => this.main.eventService.ArtistDeclineByArtist(this.request),
      (res)=>{
        this.GetMessages();
      }
    );
  }


}

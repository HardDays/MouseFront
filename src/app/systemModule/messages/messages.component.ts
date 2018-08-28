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
import { CurrencyIcons } from '../../core/models/preferences.model';
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';
import { SettingsService } from '../../core/services/settings.service';

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

  nonPhoto = BaseImages.NoneFolowerImage;

  CurrentCurrency = '$';

  constructor(
    protected main           : MainService,
    protected _sanitizer     : DomSanitizer,
    protected router         : Router,
    protected mapsAPILoader  : MapsAPILoader,
    protected ngZone         : NgZone,
    protected activatedRoute : ActivatedRoute,
    protected cdRef          : ChangeDetectorRef,
    protected translate      :TranslateService,
    protected settings       :SettingsService
  ) {
    super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute,translate,settings);
  }
  
  ngOnInit() 
  {
     
     
    this.accountId = this.main.CurrentAccount.id;
    this.type = this.main.CurrentAccount.account_type;
    this.GetMessages();
    

    this.main.MyAccountsChange.subscribe(
      (acc)=>{
        //console.log(acc);
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

    this.CurrentCurrency = CurrencyIcons[this.main.settings.GetCurrency()];

    this.messages = [];

    if(this.accountId)
    this.WaitBeforeLoading(
      () => this.main.accService.GetInboxMessages(this.accountId),
      (res:InboxMessageModel[])=>{
        this.messages = res;
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
          // console.log(`1111`);
          // if(this.messages[0].message_type ==='blank'){
            // this.openMessage = null;
            this.main.accService.GetInboxMessageById(this.accountId,this.messages[0].id)
              .subscribe((res)=>{
                // console.log(res);
                this.openMessage = res;
                

                 if(!this.openMessage.is_receiver_read){
                  this.main.accService.ReadMessageById(this.accountId,this.messages[0].id)
                    .subscribe((res)=>{
                      this.main.accService.onMessagesChange$.next(true);
                      this.openMessage.is_receiver_read = true;
                      this.messages.find(obj=>obj.id === this.openMessage.id).is_receiver_read = true;
                    })
                }

                this.openMessage.reply.unshift({
                  created_at: this.openMessage.created_at,
                  id:this.openMessage.id,
                  message:this.openMessage.message,
                  message_type:this.openMessage.message_type,
                  sender: this.openMessage.sender,
                  sender_id:this.openMessage.sender_id,
                  subject:this.openMessage.subject
                  }
                )


                for(let m of this.openMessage.reply){
                  if(m.sender&&m.sender.image_id)
                    m.sender.image_base64 = this.main.imagesService.GetImagePreview(m.sender.image_id,{width:140,height:140});
                  else
                    m.sender.image_base64 = BaseImages.NoneFolowerImage;
                }
                this.idCurMsg = res.id;
                this.setDateRange();
              })
          // }
          // else{
          //   this.openMessage = this.messages[0];
          //   this.idCurMsg = this.messages[0].id;
          //   //this.openFullMessage();
          //   this.setDateRange();
          // }
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

  changeItem(msg:InboxMessageModel,i:number)
  {
    // if(msg.message_type ==='blank'){
      // this.openMessage = null;


      

      this.main.accService.GetInboxMessageById(this.accountId,msg.id)
        .subscribe((res)=>{
          this.openMessage = res;

          if(!this.openMessage.is_receiver_read){
            this.main.accService.ReadMessageById(this.accountId,msg.id)
              .subscribe((res)=>{
                this.main.accService.onMessagesChange$.next(true);
                this.openMessage.is_receiver_read = true;
                this.messages.find(obj=>obj.id === this.openMessage.id).is_receiver_read = true;
              })
          }
          
          this.openMessage.reply.unshift({
            created_at: this.openMessage.created_at,
            id:this.openMessage.id,
            message:this.openMessage.message,
            message_type:'Support',
            sender: this.openMessage.sender,
            sender_id:this.openMessage.sender_id,
            subject:this.openMessage.subject
            }
          )

          for(let m of this.openMessage.reply){
            if(m.sender){
              if(m.sender.image_id)
                m.sender.image_base64 = this.main.imagesService.GetImagePreview(m.sender.image_id,{width:140,height:140});
              else
                m.sender.image_base64 = BaseImages.NoneFolowerImage;
            }
          }
          this.idCurMsg = res.id;
          this.accOpen =  this.accs[i];

           this.setDateRange();
        })
    }
    // else{
    //   this.openMessage = msg;
    //   //this.openFullMessage();
    //   this.idCurMsg = msg.id;
    //   this.accOpen =  this.accs[i];
    //   this.setDateRange();
    // }
  

  // openFullMessage(){
  //   this.main.accService.GetInboxMessageById(this.main.CurrentAccount.id,this.openMessage.id)
  //     .subscribe(
  //       (res)=>{
  //         this.openMessage = res;
  //       }
  //     )
  // }

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

  isExpiresSoonByExpireDate(date:string)
  {
    // let expire = this.getExpireDate(date,frame);
    let today = new Date();
    let expire = new Date(date);
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
    this.request.currency = this.main.settings.GetCurrency();

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

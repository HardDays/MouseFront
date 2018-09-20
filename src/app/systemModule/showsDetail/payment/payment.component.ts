import { Component, OnInit, Input, NgZone, ChangeDetectorRef } from "@angular/core";
import { BaseComponent } from '../../../core/base/base.component';
import { EventGetModel } from "../../../core/models/eventGet.model";
import { MainService } from "../../../core/services/main.service";
import { DomSanitizer} from "@angular/platform-browser";
import { Router, ActivatedRoute} from "@angular/router";
import { MapsAPILoader } from "@agm/core";
import { TranslateService } from "@ngx-translate/core";
import { SettingsService } from "../../../core/services/settings.service";
import { Data } from '../showDetail.data';
import {Location} from '@angular/common';
import { BaseImages } from "../../../core/base/base.enum";
import { BuyTicketModel } from "../../../core/models/buyTicket.model";
import { CurrencyIcons, TimeFormat } from "../../../core/models/preferences.model";
import * as moment from 'moment';
import { PurchaseModel, TicketPurchaseModel } from "../../../core/models/purchase.model";
import { TransactionModel } from '../../../core/models/transaction.model';
import { AccountGetModel } from "../../../core/models/accountGet.model";
declare var $:any;
@Component({
    selector: 'payment-show-detail',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentShowDetailComponent extends BaseComponent implements OnInit {
    EventId: number = 0;
    Event: EventGetModel = new EventGetModel();
    Image: string = BaseImages.Drake;
    Tickets: BuyTicketModel[] = [];
    Currency: string = "";
    Time: string = "";
    Total: number = 0;
    isPrint = false;
    TicketsPrint: BuyTicketModel[] = [];
    Verification:string = "";
    dateOfpay:Date;
    PaymentSuccess = false;
    PaymentFail = false;
    accountForPrint:AccountGetModel = new AccountGetModel();
    constructor(
        protected main           : MainService,
        protected _sanitizer     : DomSanitizer,
        protected router         : Router,
        protected mapsAPILoader  : MapsAPILoader,
        protected ngZone         : NgZone,
        protected activatedRoute : ActivatedRoute,
        protected cdRef          : ChangeDetectorRef,
        protected translate      :TranslateService,
        protected settings       :SettingsService,
        private location: Location,
        private data : Data
    ) {
    super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute,translate,settings);
    }
    ngOnInit(): void {
        this.activatedRoute.params.forEach((params)=>{
            this.Currency = CurrencyIcons[this.main.settings.GetCurrency()];
            this.EventId = params["id"];
            if(this.EventId == this.data.storage.EventId && this.data.storage.Tickets.length > 0)
            {
                this.Tickets = this.data.storage.Tickets;
                // console.log(this.Tickets);
            }
            else{
                this.router.navigate(['../'], {relativeTo: this.activatedRoute});
                return;
            }
            // console.log(this.EventId);
            // console.log("scroll_position",window.scrollY);
            this.GetEventInfo();
            // this.GetComments();
        });

        this.activatedRoute.queryParams.subscribe(
            params => {
              if(params.paymentId)
              {
                  this.Verification = params.paymentId;
                  this.router.navigateByUrl(window.location.pathname);
                    this.main.eventService.FinishPayPal({paymentId: this.Verification})
                        .subscribe(
                            res => {
                                let id = this.GetCurrentAccId();
                                this.PaymentSuccess = true;
                                this.dateOfpay = res[0].created_at;
                                this.main.accService.GetMyAccount({extended:true}).subscribe((res)=>{
                                    for(let u of res)
                                    {
                                      if(u.id == id)
                                      {
                                        this.accountForPrint = u;
                                      }
                                    }
                                });
                               
                                
                                this.data.storage = {
                                    EventId: null,
                                    Tickets:[]
                                };
                                this.data.SaveStorage();
                            },
                            (err) => {
                                this.router.navigate(['../'], {relativeTo: this.activatedRoute});
                                return;
                            }
                        )
              }
            }
          );
    }
    



    createRange(number){
        var items: number[] = [];
        for(var i = 1; i <= number; i++){
           items.push(i);
        }
        return items;
      }
    GetEventInfo()
    {
        this.WaitBeforeLoading
        (
            () => this.main.eventService.GetEventById(this.EventId),
            (res: any) => {
                this.InitEvent(res);
            },
            (err:any) => {
              //  console.log("Cant get event info",err);
            }
        );
    }

    InitEvent(event:EventGetModel)
    {
        this.Event = event;
        // console.log(this.Event);
        // this.SetMetaTags();
        this.GetImage();
        this.SetTime();
        this.GetTotal();
        // this.FoundedPercent = 100*this.Event.founded / this.Event.funding_goal;

        // if(this.Event.hashtag)
        //     this.Event.hashtag = this.Event.hashtag.replace("#","");


        // this.Currency = CurrencyIcons[this.Event.currency];
        // this.GetEventUpdates();
        // this.GetGenres();
        // this.GetCreatorInfo();
        // this.GetFeaturing();
        // this.GetVenueInfo();
        // this.GetTickets();
        // this.SetDate();
    }

    GetImage()
    {
        if(this.Event && this.Event.image_id)
        {
            
            this.Image = this.main.imagesService.GetImagePreview(this.Event.image_id, {width:700, height:950});
            // this.ImageTw = this.main.imagesService.GetImagePreview(this.Event.image_id, {width:510, height:228});
            // setTimeout(()=>{
            //     this.SetMetaTagsImage();
            // },200);
            
            // this.main.imagesService.GetImageById(this.Event.image_id)
            //     .subscribe(
            //         (res:Base64ImageModel) => {
                        
            //             this.Image = (res && res.base64) ? res.base64 : BaseImages.Drake;
            //             this.SetMetaTagsImage();
            //         }
            //     );
        }
    }

    SetTime()
    {
        const timeFormat = this.main.settings.GetTimeFormat() == TimeFormat.CIS ? 'HH:mm' : 'hh:mm A';
        if(this.Event.exact_date_from)
        {
            this.Time = moment(this.Event.exact_date_from).format(timeFormat);
        }
    }

    GetTotal()
    {
        this.Total = 0;
        for(let item of this.Tickets)
        {
            this.Total += item.count * item.ticket.price;
        }
        this.Total = Math.round(this.Total * 100) / 100;
    }
    goBack() {
        this.router.navigate(['../'], {relativeTo: this.activatedRoute});
        // this.location.back();
    }

    BuyTicket()
    {
        const purchase = new PurchaseModel();
        purchase.tickets = TicketPurchaseModel.TicketPurchaseArrayFromObjectArray(this.Tickets);

        purchase.redirect_url = window.location.href.split('?')[0];

        purchase.account_id = this.GetCurrentAccId();
        console.log(purchase);
        this.WaitBeforeLoading(
            () => this.main.eventService.StartPurchaseTickets(purchase),
            (res:TransactionModel) =>
            {
                // console.log(res);
                window.location.href = res.url;
            },
            (err) =>
            {
                this.PaymentFail = true;
                
                // this.OpenErrorWindow(this.getResponseErrorMessage(err));
            }
        );
    }
    // blockNone(){
    //     $('#print').addClass('blockImportant');
    //     $('#print').removeClass('blockImportant');
    // }

    printTicket(){

        // var originalContents = document.body.innerHTML;
        this.isPrint = true;
        
        setTimeout(() => {
         var css = '@page { size: portrait; }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
    
        style.type = 'text/css';
        style.media = 'print';
    
        if (style['styleSheet']){
          style['styleSheet'].cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
    
        head.appendChild(style);
    
    
    
        // var printContents = document.getElementById('print').innerHTML;
        
        //  document.body.innerHTML = printContents;
    
         window.print();
    
          setTimeout(() => {
            this.isPrint = false;
          }, 100);
         
    
        //  document.body.innerHTML = originalContents;
        }, 200);
        
    
      }
}
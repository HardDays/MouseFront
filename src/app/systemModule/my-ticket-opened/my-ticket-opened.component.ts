import { Component, OnInit, NgZone, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { Router, Params,ActivatedRoute  } from '@angular/router';
import { AuthMainService } from '../../core/services/auth.service';
import { AccountService } from '../../core/services/account.service';
import { GenresService } from '../../core/services/genres.service';
import { AuthService } from 'angular2-social-login';
import { MapsAPILoader } from '@agm/core';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { EventService } from '../../core/services/event.service';
import { TypeService } from '../../core/services/type.service';
import { ImagesService } from '../../core/services/images.service';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { NgForm } from '@angular/forms';
import { AccountType } from '../../core/base/base.enum';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { TicketsGetModel } from '../../core/models/ticketsGetModel';
import { BaseImages } from '../../core/base/base.enum';
import { TicketsByEventModel } from '../../core/models/ticketsByEvent.model';
import { MainService } from '../../core/services/main.service';
import { Currency, CurrencyIcons } from '../../core/models/preferences.model';

@Component({
  selector: 'app-my-ticket-opened',
  templateUrl: './my-ticket-opened.component.html',
  styleUrls: ['./my-ticket-opened.component.css']
})
export class MyTicketOpenedComponent extends BaseComponent implements OnInit,AfterViewChecked{
  event_id:number;
  accountId:number;
  TotalOriginalPrice:number = 0;
  TotalAproxPrice:number = 0;
  TicketsByEvent:TicketsByEventModel = new TicketsByEventModel();
  Image:string = BaseImages.Drake;

  // Currency = CurrencyIcons[this.main.settings.GetCurrency()];

  isPrint = false;
  
  MyCurrency = CurrencyIcons[this.main.settings.GetCurrency()];
  OriginalCurrency = CurrencyIcons[Currency.USD];
  
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

    this.MyCurrency = CurrencyIcons[this.main.settings.GetCurrency()];
  }

  ngOnInit() 
  {
    this.activatedRoute.params.forEach(
      (params) => {
        this.event_id = params["id"];
        // this.Currency = CurrencyIcons[this.main.settings.GetCurrency()];
        this.initUser();
      }
    );
  }
  ngAfterViewChecked()
  {
      this.cdRef.detectChanges();
  }

  GetImage()
  {
      if(this.TicketsByEvent.event && this.TicketsByEvent.event.image_id)
      {
          this.WaitBeforeLoading(
              () => this.main.imagesService.GetImageById(this.TicketsByEvent.event.image_id),
              (res:Base64ImageModel) => {
                  this.Image = (res && res.base64) ? res.base64 : BaseImages.Drake;
              },
              (err) =>{
              }
          );
      }
  }


  initUser()
  {
    let id = this.GetCurrentAccId();
    // if(id)
    // {
    //   let account = this.main.MyAccounts.find( obj => obj.id == id);
    //   if(account)
    //   {
    //     this.accountId = account.id;
    //     this.GetTicketsByEvent();
    //   }
    // }
    this.WaitBeforeLoading(
      () => this.main.accService.GetMyAccount({extended:true}),
      (users:any[])=>{
        for(let u of users)
        {
          if(u.id == id)
          {
            this.accountId = u.id;
            this.GetTicketsByEvent();
          }
        }
      }
    );
  }

  GetTicketsByEvent()
  {
    this.WaitBeforeLoading(
      () => this.main.eventService.GetTicketsByEvent(this.accountId,this.event_id),
      (res:TicketsByEventModel) =>
      {
        this.TicketsByEvent = res;
        // console.log(this.TicketsByEvent);
        this.GetImage();
        this.CountTotalPrice();
      },
      (err) => {
      //  console.log(err);
      }
    );
  }

  CountTotalPrice()
  {
    this.TotalOriginalPrice = 0;
    this.TotalAproxPrice = 0;
    for(let i of this.TicketsByEvent.tickets)
    {
      if(i.original_price)
        this.TotalOriginalPrice+=i.original_price;
      if(i.price)
        this.TotalAproxPrice += i.price;
      this.OriginalCurrency = CurrencyIcons[i.currency];
    }

    this.TotalAproxPrice = Math.round(this.TotalAproxPrice * 100) / 100;
    this.TotalOriginalPrice = Math.round(this.TotalOriginalPrice * 100) / 100;
  }

  printTicket(){

    // var originalContents = document.body.innerHTML;
    this.isPrint = true;
   
    setTimeout(() => {
     var css = '@page { size: landscape; }',
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
    }, 100);
    

  }

  getCurrency(currency){
    return CurrencyIcons[currency];
  }
}

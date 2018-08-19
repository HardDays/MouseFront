import { Component, OnInit, ViewChild, ElementRef, NgZone, ChangeDetectorRef, AfterViewChecked, HostListener } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';
import { AccountService } from '../../core/services/account.service';
import { ImagesService } from '../../core/services/images.service';
import { TypeService } from '../../core/services/type.service';
import { GenresService } from '../../core/services/genres.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { AuthService } from "angular2-social-login";

import { BaseComponent } from '../../core/base/base.component';

import { AccountCreateModel } from '../../core/models/accountCreate.model';
import { UserCreateModel } from '../../core/models/userCreate.model';
import { GenreModel } from '../../core/models/genres.model';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { SafeHtml, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AccountType, BaseMessages, EventStatus, AccountStatus } from '../../core/base/base.enum';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { MapsAPILoader } from '@agm/core';
import { AccountSearchParams } from '../../core/models/accountSearchParams.model';
import { EventService } from '../../core/services/event.service';
import { Http } from '@angular/http';
import { UserGetModel } from '../../core/models/userGet.model';
import { EventGetModel } from '../../core/models/eventGet.model';
import { TicketGetParamsModel } from '../../core/models/ticketGetParams.model';
import { TicketModel } from '../../core/models/ticket.model';
import { BuyTicketModel } from '../../core/models/buyTicket.model';
import { MainService } from '../../core/services/main.service';
import { ErrorComponent } from '../../shared/error/error.component';

import * as moment from 'moment';
import { TimeFormat, CurrencyIcons, Currency } from '../../core/models/preferences.model';
import { PurchaseModel } from '../../core/models/purchase.model';
import { TransactionModel } from '../../core/models/transaction.model';

declare var $:any;
declare var PhotoSwipeUI_Default:any;
declare var PhotoSwipe:any;


@Component({
    selector: 'shows-detail-main',
    templateUrl: './showsDetail.component.html', 
    styleUrls: ['./showsDetail.component.css'],
})
export class ShowsDetailComponent extends BaseComponent implements OnInit,AfterViewChecked {
    EventId:number = 0;
    Event:EventGetModel = new EventGetModel();
    Creator:AccountGetModel = new AccountGetModel();
    Artists:AccountGetModel[] = [];
    Tickets:TicketModel [] = [];
    Venue:AccountGetModel = new AccountGetModel();
    
    Date:string = "";

    CheckedTickets:any[] = [];

    TicketsToBuy:BuyTicketModel[] = [];
    TotalPrice:number = 0;
    TotalOriginalPrice: number = 0;

    Genres:GenreModel[] = [];

    Featuring:{name:string,id:number}[] = [];

    Statuses = EventStatus;

    isShowMap = false;

    ESCAPE_KEYCODE = 27;
    ENTER_KEYCODE = 13;

    Status = AccountStatus;

    Currency = CurrencyIcons[this.main.settings.GetCurrency()];
    OriginalCurrency = CurrencyIcons[Currency.USD];

    MyAcc = this.main.CurrentAccount;
  
    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if(this.isShowMap){
            if (event.keyCode === this.ESCAPE_KEYCODE || event.keyCode === this.ENTER_KEYCODE) {
              $('#modal-map').modal('hide');
              this.isShowMap = false;
            }
        }
    }
    
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

    @ViewChild('errorCmp') errorCmp: ErrorComponent;

    ngOnInit(): void
    {
        this.activatedRoute.params.forEach((params)=>{
            this.EventId = params["id"];
            // console.log("scroll_position",window.scrollY);
            this.GetEventInfo();
        });
        this.main.CurrentAccountChange.subscribe(
            (val) => {
                this.MyAcc = val;
            }
        );
    }

    ngAfterViewChecked()
    {
        this.cdRef.detectChanges();
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

    GetVenueInfo()
    {
        if(this.Event.venue){
            this.WaitBeforeLoading(
                () => this.main.accService.GetAccountById(this.Event.venue.id),
                (res:AccountGetModel) =>
                {
                    this.Venue = res;
                }
            );
        }
    }

    InitEvent(event:EventGetModel)
    {
        this.Event = event;

        if(this.Event.hashtag)
            this.Event.hashtag = this.Event.hashtag.replace("#","");


        // this.Currency = CurrencyIcons[this.Event.currency];

        this.GetGenres();
        this.GetCreatorInfo();
        this.GetFeaturing();
        this.GetVenueInfo();
        this.GetTickets();
        this.SetDate();
    }

    GetFeaturing()
    {
        this.Featuring = [];
        let artistArr:string[] = [];
        this.Artists = [];
        // console.log(this.Event.artist);
        let arr = this.Event.artist.filter( obj => obj.status == "active"|| obj.status == "owner_accepted");
        for(let i in arr)
        {
            this.WaitBeforeLoading
            (
                () => this.main.accService.GetAccountById(arr[i].artist_id),
                (res:AccountGetModel) => {
                    this.Artists.push(res);

                    // if( +i < (arr.length -1 ) )
                    let name = res.display_name;
                    let id = res.id;
                    this.Featuring.push({name,id});
                    // if( +i < (arr.length - 1))
                    // {
                    //     artistArr.push(res.display_name)
                    // }


                    // if(arr.length - 1 == artistArr.length)
                    // {
                    //     this.Featuring = artistArr.join(", ");
                    //     this.Featuring += " and " + res.display_name;
                    // }
                }
            );
        }
    }

    GetGenres()
    {
        this.Genres = this.main.genreService.StringArrayToGanreModelArray(this.Event.genres);
    }

    GetCreatorInfo()
    {
        if(this.Event.creator_id)
        {
            this.WaitBeforeLoading
            (
                () => this.main.accService.GetAccountById(this.Event.creator_id),
                (res: AccountGetModel) => {
                    this.Creator = res;
                },
                (err:any) =>
                {
                 //   console.log("Cant get creator info", err);
                }
            );
        }
    }

    GetTickets()
    {
        this.Tickets = this.Event.tickets;
        if(this.Event.tickets.length>0)
            this.OriginalCurrency = CurrencyIcons[this.Event.tickets[0].currency];
        else this.OriginalCurrency = CurrencyIcons[this.main.settings.GetCurrency()];
        // console.log(this.Tickets);
        // this.Currency = CurrencyIcons[this.Event.tickets[0].currency];
    }

    AddTicketsToPrice(object:BuyTicketModel)
    {
        this.TicketsToBuy.push(object);
        this.CalculateCurrentPrice();
        this.OpenErrorWindow(object.count + " ticket" + (object.count > 1 ?"s ": " ") + "added to your cart!");
    }

    CalculateCurrentPrice()
    {
        this.TotalPrice = 0;
        this.TotalOriginalPrice = 0;
        for(let item of this.TicketsToBuy)
        {
            this.TotalPrice += item.count * item.ticket.price;
            this.TotalOriginalPrice += item.count * item.ticket.original_price;
        }
        this.TotalPrice = Math.round(this.TotalPrice * 100) / 100;
        this.TotalOriginalPrice = Math.round(this.TotalOriginalPrice * 100) / 100;
    }

    BuyTickets()
    {
        let myAcc = this.GetCurrentAccId();
        if(myAcc)
        {
            this.CheckedTickets = this.GroupTickets(this.TicketsToBuy,myAcc);
            this.BuyTicket();
        }
    }



    BuyTicket()
    {
        let items = this.CheckedTickets;
        const url = [
            window.location.origin,
            'system',
            'tickets',
            this.EventId
        ].join("/");

        for(let item of items)
        {
            const purchase = new PurchaseModel();
            purchase.ExportFromTicket(item);
            purchase.redirect_url = url;
            this.WaitBeforeLoading(
                () => this.main.eventService.StartPurchaseTickets(purchase),
                (res:TransactionModel) =>
                {
                    window.location.href = res.url;
                    // let index = this.CheckedTickets.findIndex(obj => obj.ticket_id == item.ticket_id && obj.count == item.count);
                    // this.CheckedTickets.splice(index,1);
                    // this.CalculateCurrentPrice();
                    // if(this.CheckedTickets.length == 0)
                    // {
                    //    // console.log("success");
                    //     this.OpenErrorWindow(BaseMessages.Success);
                    //   //  console.log('show_message');
                    //     setTimeout(
                    //         () => {
                    //             this.errorCmp.CloseWindow();
                    //             this.router.navigate(['/system','tickets', this.EventId])
                    //         },
                    //         2000
                    //     );
                    // }
                },
                (err) =>
                {
                    this.OpenErrorWindow(this.getResponseErrorMessage(err));
                }
            );
        }
    }

    GroupTickets(arr: BuyTicketModel[],accId:number)
    {
        let tickets =  this.GroupBy(arr, item => item.ticket.id);

        let result:any[] = [];
        tickets.forEach(
            (element:BuyTicketModel[],key:number) =>
            {
                let object = {
                    ticket_id:key,
                    count:0,
                    account_id:accId,
                    price: 0
                }

                for(let item of element)
                {
                    object.count += item.count;
                    
                    // добавить цену за один билет \\
                    object.price = item.ticket.price;
                }

                result.push(object);
            }
        );
        return result;
    }

    GroupBy(list,keyGetter)
    {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            const collection = map.get(key);
            if (!collection) {
                map.set(key, [item]);
            } else {
                collection.push(item);
            }
        });
        return map;
    }

    OpenErrorWindow(str:string)
    {
        this.errorCmp.OpenWindow(str);
    }

    aboutOpenMapModal(){
        $('#modal-map').modal('show');
        this.isShowMap = true;
    }

    InitSlider(bool:boolean)
    {
        if(!$('.iframe-slider-wrapp').not('.slick-initialized').length){
            $('.iframe-slider-wrapp').slick('unslick');
        }

        // if($('.iframe-slider-wrapp').not('.slick-initialized').length){
        //     console.log('проинитили слайдер');
        //     $('.iframe-slider-wrapp').slick({
        //         dots: false,
        //         arrows: true,
        //         infinite: false,
        //         slidesToShow: 1
        //     });

        // }
        setTimeout(()=>{
            this.InitSliderWrapp();
        },1000);
    }

    InitSliderWrapp() 
    {
        if($('.iframe-slider-wrapp').not('.slick-initialized').length){
            $('.iframe-slider-wrapp').slick({
                dots: false,
                arrows: true,
                infinite: false,
                slidesToShow: 1
            });

        }
        //если да
    }

    SetDate()
    {
        this.Date = "";
        const timeFormat = this.main.settings.GetTimeFormat() == TimeFormat.CIS ? 'HH:mm' : 'hh:mm A';
        const dateTimeFromat = "dddd, MMM DD, YYYY " + timeFormat;
        if(!this.Event.date_from && !this.Event.date_to)
        {
            this.Date = this.Event.event_season + ", " + this.Event.event_year;
            if(this.Event.event_time)
            {
                this.Date = this.Date + " - <span>"+this.Event.event_time+"</span>"
            }
        }
        else if (this.Event.date_from && this.Event.date_to)
        {
            let from = this.Event.date_from.split("T")[0];            
            let to = this.Event.date_to.split("T")[0];
            if(from === to){
                let m = moment(this.Event.date_from);
                this.Date = m.format(dateTimeFromat);
                this.Date = this.Date + " - <span>"+ moment(this.Event.date_to).format(timeFormat)+"</span>";
                //this.Date = date.toLocaleDateString('EEEE, MMM d, yyyy HH:mm');
            }
            else{
                this.Date = moment(this.Event.date_from).format(dateTimeFromat) + " - " + moment(this.Event.date_to).format(dateTimeFromat);
            }
        }
    }
}

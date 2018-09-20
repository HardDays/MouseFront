import { Component, OnInit, ViewChild, ElementRef, NgZone, ChangeDetectorRef, AfterViewChecked, HostListener } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';
import { AccountService } from '../../core/services/account.service';
import { ImagesService } from '../../core/services/images.service';
import { TypeService } from '../../core/services/type.service';
import { GenresService } from '../../core/services/genres.service';
import { Router, Params, ActivatedRoute, NavigationEnd, NavigationStart} from '@angular/router';
import { AuthService } from "angular2-social-login";

import { BaseComponent } from '../../core/base/base.component';
import { Meta } from '@angular/platform-browser';
import { AccountCreateModel } from '../../core/models/accountCreate.model';
import { UserCreateModel } from '../../core/models/userCreate.model';
import { GenreModel } from '../../core/models/genres.model';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { SafeHtml, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AccountType, BaseMessages, EventStatus, AccountStatus, BaseImages, tabsShowDetails } from '../../core/base/base.enum';
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
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';
import { SettingsService } from '../../core/services/settings.service';
import { PurchaseModel, TicketPurchaseModel } from '../../core/models/purchase.model';
import { TransactionModel } from '../../core/models/transaction.model';
import * as translate from '@ngx-translate/core';
import { CommentEventModel } from '../../core/models/commentEvent.model';
import {Location} from '@angular/common';
import { EventUpdatesModel } from '../../core/models/eventUpdates.model';
import { EventBackersModel } from '../../core/models/eventBackers.model';
import { Data } from './showDetail.data';
import { saveAs} from 'file-saver';
declare var $:any;
declare var PhotoSwipeUI_Default:any;
declare var PhotoSwipe:any;
declare const Buffer;


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
    Tickets:BuyTicketModel [] = [];
    Venue:AccountGetModel = new AccountGetModel();
    FoundedPercent:number = 0;
    Date:string = "";
    Image:string = BaseImages.Drake;
    ImageTw:string = BaseImages.Drake;
    CheckedTickets:any[] = [];
    
    TotalPrice:number = 0;
    TotalOriginalPrice: number = 0;
    TicketsCount: number = 0;

    Genres:GenreModel[] = [];

    Featuring:{name:string,id:number}[] = [];

    Statuses = EventStatus;
    
    FullUrl:string;
    activeTab:string = tabsShowDetails.information;
    isShowMap = false;

    ESCAPE_KEYCODE = 27;
    ENTER_KEYCODE = 13;

    Status = AccountStatus;

    Currency = CurrencyIcons[this.main.settings.GetCurrency()];
    OriginalCurrency = CurrencyIcons[Currency.USD];
    AllCommentsEvent:CommentEventModel[] = [];
    MyAcc = this.main.CurrentAccount;
    UpdatesEvent:EventUpdatesModel[] = [];
    TextSearchGoing:string;
    Allbackers:EventBackersModel[] = [];
    ShareTitle:string = "";
    baseFile:string = "";

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
        protected cdRef          : ChangeDetectorRef,
        protected translate      :TranslateService,
        protected settings       :SettingsService,
        private location: Location,
        private meta: Meta,
        private data : Data
    ) {
    super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute,translate,settings);
    }

    @ViewChild('errorCmp') errorCmp: ErrorComponent;

    ngOnInit(): void
    {
        this.FullUrl = window.location.href;
        this.activatedRoute.params.forEach((params)=>{
            this.EventId = params["id"];
            this.GetEventInfo();
            this.GetComments();
        });

     
        this.main.CurrentAccountChange.subscribe(
            (val) => {
                this.MyAcc = val;
            }
        );

        $('.flex-people').scroll(()=>{
            if(($('.flex-people').scrollTop()+$('.flex-people').height()) >= document.getElementById("heightCalc").scrollHeight){
                this.onScroll();
            }
        });
    }
    ngOnDestroy(){
        this.DestroyMetaTags();
        $('#modal-who-going').modal('hide');
    }

    ngAfterViewChecked()
    {
        this.cdRef.detectChanges();
    }

    SetMetaTags(){
        this.meta.addTags([
            {name: 'og:title', content: this.Event.name},
            {name: 'twitter:title', content: this.Event.name},
            {itemprop: 'name', content: this.Event.name}
        ]);
    }
    SetMetaTagsImage(){
        this.meta.addTags([
            {name: 'og:image', content: this.ImageTw},
            {name: 'twitter:image', content: this.ImageTw},
            {itemprop: 'image', content: this.ImageTw}
        ]);
       
    }
    DestroyMetaTags(){
      
        this.meta.removeTagElement(this.meta.getTag('name="og:title"'));
        this.meta.removeTagElement(this.meta.getTag('name="twitter:title"'));
        this.meta.removeTagElement(this.meta.getTag('itemprop="name"'));
        this.meta.removeTagElement(this.meta.getTag('name="og:image"'));
        this.meta.removeTagElement(this.meta.getTag('name="twitter:image"'));
        this.meta.removeTagElement(this.meta.getTag('itemprop="image"')); 

    }


    GetComments(){
        this.main.commentService.GetCommentsEvent(this.EventId)
          .subscribe((res:any)=>{
            this.AllCommentsEvent = res;
          })
    }
    onChangeInpSearch(event){
        this.TextSearchGoing = event.target.value;
        this.main.eventService.EventGoingAcc(this.Event.id,20,0,this.TextSearchGoing).subscribe((res:any)=>{
            this.Allbackers = res;
        })
        
    }
    onChangeInptitle(event){
        this.ShareTitle = event.target.value;
    }
    copylink(element){
       
        var $temp = $("<input>");
        $("body").append($temp);
        $temp.val($(element).text()).select();
        document.execCommand("copy");
        $temp.remove();
    };
    goBack() {
        this.location.back();
    }
    onScroll(){
       
        this.main.eventService.EventGoingAcc(this.Event.id,20,this.Allbackers.length,this.TextSearchGoing).subscribe((res:any)=>{
            this.Allbackers.push(...res);
        })
    }
    OpenModalGoing(){
        $('#modal-who-going').modal('show');
        this.main.eventService.EventGoingAcc(this.Event.id,20,0,this.TextSearchGoing).subscribe((res:any)=>{
            this.Allbackers = res;
        })

    }
    OpenModalShare(){
        $('#modal-share').modal('show');
    }
    // getGoingHuman(id:number,limit:number,offset:number,text?:string){
    //     this.main.eventService.EventGoingAcc(id,limit,offset,text).subscribe((res:any)=>{
    //         this.Allbackers = res;
    //         console.log(this.Allbackers);
    //     })
    // }

    
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
    GetEventUpdates(){
        this.main.eventService.EventsUpdates(this.EventId).subscribe((res:any)=>{
            this.UpdatesEvent = res;
        }) 
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
    GetImage()
    {
        if(this.Event && this.Event.image_id)
        {
            
            this.Image = this.main.imagesService.GetImagePreview(this.Event.image_id, {width:700, height:950});
            this.ImageTw = this.main.imagesService.GetImagePreview(this.Event.image_id, {width:510, height:228});
            setTimeout(()=>{
                this.SetMetaTagsImage();
            },200);
            
            // this.main.imagesService.GetImageById(this.Event.image_id)
            //     .subscribe(
            //         (res:Base64ImageModel) => {
                        
            //             this.Image = (res && res.base64) ? res.base64 : BaseImages.Drake;
            //             this.SetMetaTagsImage();
            //         }
            //     );
        }
    }
    GetCaledarFile(){
        this.main.eventService.GetCalendarEventFile(this.EventId).subscribe((res:any)=>{
            this.baseFile = res.file;
            // console.log(this.baseFile);
        }) 
    }
    downloadFile(){
        
         
        let type = 'ics';
        
        let file = this.baseFile;

        var decoded = new Buffer(file, 'base64');
        var blob = new Blob([decoded], { type: type });
        

        saveAs(blob,'calendar.'+type);
    
         
        
      }

    InitEvent(event:EventGetModel)
    {
        this.Event = event;
        console.log(this.Event);
        this.SetMetaTags();
        this.GetImage();
        this.GetCaledarFile();
        this.FoundedPercent = 100*this.Event.founded / this.Event.funding_goal;

        if(this.Event.hashtag)
            this.Event.hashtag = this.Event.hashtag.replace("#","");


        // this.Currency = CurrencyIcons[this.Event.currency];
        this.GetEventUpdates();
        this.GetGenres();
        this.GetCreatorInfo();
        this.GetFeaturing();
        this.GetVenueInfo();
        this.GetTickets();
        this.SetDate();
    }
    ToInfo(){
        this.activeTab = tabsShowDetails.information;
    }
    ToComments(){
        this.activeTab = tabsShowDetails.comments;
    }
    ToUpdates(){
        this.activeTab = tabsShowDetails.updates;
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
        if(this.Event.tickets && this.Event.tickets.length > 0){
            for(const item of this.Event.tickets)
            {
                this.Tickets.push(new BuyTicketModel(0,item));
            }
        }
        if(this.data.storage && this.data.storage.EventId == this.EventId)
        {
            for(const item of this.data.storage.Tickets)
            {
                const index = this.Tickets.findIndex(obj => obj.ticket.id == item.ticket.id);
                if(index > -1)
                {
                    this.Tickets[index].count = item.count;
                }
            }
        }
        // this.Tickets = this.Event.tickets;
        if(this.Event.tickets.length>0)
            this.OriginalCurrency = CurrencyIcons[this.Event.tickets[0].currency];
        else this.OriginalCurrency = CurrencyIcons[this.main.settings.GetCurrency()];
        // console.log(this.Tickets);
        // this.Currency = CurrencyIcons[this.Event.tickets[0].currency];
        this.CalculateCurrentPrice();
    }

    AddTicketsToPrice(object:BuyTicketModel)
    {
        // console.log(this.Tickets);
        // const index = this.TicketsToBuy.findIndex(obj => obj.ticket.id == object.ticket.id);
        // if(index < 0)
        // {
        //     this.TicketsToBuy.push(object);
        // }
        // else{
        //     this.TicketsToBuy[index].count = object.count;
        // }
        // // this.TicketsToBuy.push(object);
        this.CalculateCurrentPrice();
    }

    CalculateCurrentPrice()
    {
        this.TotalPrice = 0;
        this.TotalOriginalPrice = 0;
        this.TicketsCount = 0;
        for(let item of this.Tickets)
        {
            this.TicketsCount += item.count;
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
            this.data.storage = {
                EventId: this.EventId,
                Tickets: this.Tickets.filter(obj => obj.count > 0)
            };
            this.data.SaveStorage();
            this.router.navigate(['start_purchase'], {relativeTo: this.activatedRoute});
        }
    }



    BuyTicket()
    {
        const purchase = new PurchaseModel();
        purchase.tickets = TicketPurchaseModel.TicketPurchaseArrayFromObjectArray(this.CheckedTickets);

        purchase.redirect_url = [
            window.location.origin,
            'system',
            'tickets',
            this.EventId
        ].join("/");

        purchase.account_id = this.GetCurrentAccId();
        this.WaitBeforeLoading(
            () => this.main.eventService.StartPurchaseTickets(purchase),
            (res:TransactionModel) =>
            {
                window.location.href = res.url;
            },
            (err) =>
            {
                
                this.OpenErrorWindow(this.getResponseErrorMessage(err));
            }
        );
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
    ToUppercaseLetter(date, format) : string{
        let formDate = moment(date).format(format);
        return formDate[0].toUpperCase() + formDate.substr(1) + ' ';
    }

    SetDate()
    {
        this.isEnglish() != true?moment.locale('ru'):moment.locale('en');
        this.Date = "";
        const timeFormat = this.main.settings.GetTimeFormat() == TimeFormat.CIS ? 'HH:mm' : 'hh:mm A';
        const dateTimeFromat = "DD, YYYY " + timeFormat;
        
        if(this.Event.exact_date_from)
        {
            this.Date = this.ToUppercaseLetter(this.Event.exact_date_from, "MMM") 
                + moment(this.Event.exact_date_from).format(" DD, YYYY ")
                + "<span>" + moment(this.Event.exact_date_from).format(timeFormat) + "</span>";
        }
        else if(!this.Event.date_from && !this.Event.date_to)
        {
            this.Date = this.GetTranslateString(this.Event.event_season) + ' ' + this.Event.event_year;
            if(this.Event.event_time)
            {
                this.Date = this.Date + " - <span>"+this.GetTranslateString(this.Event.event_time)+"</span>"
            }


        }
        else if (this.Event.date_from && this.Event.date_to)
        {
            const dateFrom = this.ToUppercaseLetter(this.Event.date_from,'dddd')
                + this.ToUppercaseLetter(this.Event.date_from,'MMM')
                + moment(this.Event.date_from).format(dateTimeFromat)

            const dateTo = this.ToUppercaseLetter(this.Event.date_to,'dddd')
                 + this.ToUppercaseLetter(this.Event.date_to,'MMM')
                 + moment(this.Event.date_to).format(dateTimeFromat)

            let from = this.Event.date_from.split("T")[0];            
            let to = this.Event.date_to.split("T")[0];
            if(from === to){
                // let m = moment(this.Event.date_from);
                // this.Date = m.format(dateTimeFromat);
                this.Date = dateFrom;
                this.Date = this.Date + " - <span>"+ moment(this.Event.date_to).format(timeFormat)+"</span>";
                //this.Date = date.toLocaleDateString('EEEE, MMM d, yyyy HH:mm');
            }
            else{
                this.Date = dateFrom  + " - " + dateTo;
            }
        }
    }
}

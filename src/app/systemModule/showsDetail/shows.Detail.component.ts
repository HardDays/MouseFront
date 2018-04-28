import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
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
import { AccountType } from '../../core/base/base.enum';
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

declare var $:any;
declare var PhotoSwipeUI_Default:any;
declare var PhotoSwipe:any;


@Component({
    selector: 'shows-detail-main',
    templateUrl: './showsDetail.component.html',
    styleUrls: ['./showsDetail.component.css'],
})
export class ShowsDetailComponent extends BaseComponent implements OnInit {
    EventId:number = 0;
    Event:EventGetModel = new EventGetModel();
    Creator:AccountGetModel = new AccountGetModel();
    Artists:AccountGetModel[] = [];
    Tickets:TicketModel [] = [];
    Venue:AccountGetModel = new AccountGetModel();

    TicketsToBuy:BuyTicketModel[] = [];
    TotalPrice:number = 0;

    Genres:GenreModel[] = [];

    Featuring:string = '';

    constructor(protected authService: AuthMainService,
        protected accService:AccountService,
        protected imgService:ImagesService,
        protected typeService:TypeService,
        protected genreService:GenresService,
        protected eventService:EventService,
        protected _sanitizer: DomSanitizer,
        protected router: Router,public _auth: AuthService,
        private activatedRoute: ActivatedRoute, protected h:Http,
        private ngZone: NgZone)
    {
        super(authService,accService,imgService,typeService,genreService,eventService,_sanitizer,router,h,_auth);
    }


    ngOnInit(): void 
    {
        this.activatedRoute.params.forEach((params)=>{
            this.EventId = params["id"];
            this.GetEventInfo();
        });
    }



    GetEventInfo()
    {
        this.WaitBeforeLoading
        (
            () => this.eventService.GetEventById(this.EventId),
            (res: any) =>
            {
                // console.log("Event", res);
                this.InitEvent(res);
            },
            (err:any) => 
            {
                console.log("Cant get event info",err);
            }
        );
    }

    GetVenueInfo()
    {
        if(this.Event.venue){
            this.WaitBeforeLoading(
                () => this.accService.GetAccountById(this.Event.venue.id),
                (res:AccountGetModel) => 
                {
                    this.Venue = res;
                    console.log(this.Venue);
                }
            );
        }
    }

    InitEvent(event:EventGetModel)
    {
        this.Event = event;
        this.GetGenres();
        this.GetCreatorInfo();
        this.GetFeaturing();
        this.GetVenueInfo();
        this.GetTickets();
        // console.log(this.Event);
    }

    GetFeaturing()
    {
        this.Featuring = '';
        let artistArr:string[] = [];
        this.Artists = [];
        let arr = this.Event.artist.filter( obj => obj.status == "active" );
        for(let i in arr)
        {
            this.WaitBeforeLoading
            (
                () => this.accService.GetAccountById(arr[i].artist_id),
                (res:AccountGetModel) => 
                {
                    this.Artists.push(res);
                    if( +i < (arr.length - 1))
                    {
                        artistArr.push(res.display_name)
                    }
                    
                    if(arr.length - 1 == artistArr.length)
                    {
                        this.Featuring = artistArr.join(", ");
                        this.Featuring += " and " + res.display_name;
                    }
                }
            );
        }
    }

    GetGenres()
    {
        this.Genres = this.genreService.StringArrayToGanreModelArray(this.Event.genres);
    }

    GetCreatorInfo()
    {
        if(this.Event.creator_id)
        {
            this.WaitBeforeLoading
            (
                () => this.accService.GetAccountById(this.Event.creator_id),
                (res: AccountGetModel) => 
                {
                    this.Creator = res;
                },
                (err:any) => 
                {
                    console.log("Cant get creator info", err);
                }
            );
        }
    }

    GetTickets()
    {
        this.Tickets = this.Event.tickets;
    }

    AddTicketsToPrice(object:BuyTicketModel)
    {
        this.TicketsToBuy.push(object);
        this.CalculateCurrentPrice();
    }

    CalculateCurrentPrice()
    {
        this.TotalPrice = 0;
        for(let item of this.TicketsToBuy)
        {
            this.TotalPrice += item.count * item.ticket.price;
        }
    }

    BuyTickets()
    {
        let myAcc = this.GetActiveAccountId();
        if(myAcc)
        {
            for(let item of this.TicketsToBuy)
            {
                let object = {
                    account_id:myAcc,
                    ticket_id: item.ticket.id
                };

                while(item.count > 0)
                {
                    this.BuyTicket(object);
                    item.count -= 1;
                }
                this.CalculateCurrentPrice();
            }
            setTimeout(
                () =>
                {
                    this.router.navigate(['/system','tickets', this.EventId]);
                },
                3000
            )
        }
    }

    BuyTicket(object:any)
    {
        this.WaitBeforeLoading(
            () => this.eventService.BuyTicket(object),
            (res) => 
            {   
                //console.log(res);
            },
            (err) =>
            {
                console.log(err);
            }
        );
    }

    aboutOpenMapModal(){
        $('#modal-map').modal('show');
    }
}
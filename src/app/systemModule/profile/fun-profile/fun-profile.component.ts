import { Component, OnInit, NgZone, Input, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { TicketsGetModel } from '../../../core/models/ticketsGetModel';
import { AccountType } from '../../../core/base/base.enum';
import { AccountSearchParams } from '../../../core/models/accountSearchParams.model';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { AccountGetModel, Album } from '../../../core/models/accountGet.model';
import { EventGetModel } from '../../../core/models/eventGet.model';
import { CheckModel } from '../../../core/models/check.model';
import { Base64ImageModel } from '../../../core/models/base64image.model';
import { BaseComponent } from '../../../core/base/base.component';
declare var $:any;
@Component({
    selector: 'app-fun-profile',
    templateUrl: './fun-profile.component.html',
    styleUrls: ['./fun-profile.component.css']
})
export class FunProfileComponent extends BaseComponent implements OnInit{
   
    
    @Input() IsPreview: any;
    @Input() Account: any;
    MyAccountId:number;
    SearchParams: AccountSearchParams = new AccountSearchParams();
    isMyAccount = false;


    FolowersMass:AccountGetModel[] = [];
    Tickets:TicketsGetModel[] = [];
    Events:EventGetModel[] = [];

    folowersMassChecked:AccountGetModel[] = [];
    ticketsMassChecked:CheckModel<TicketsGetModel>[] = [];
    EventsMassChecked:CheckModel<EventGetModel>[] = [];
    TotalTicket:number;
    isFolowedAcc:boolean;
    render = false;
    constructor
    (           
        protected main         : MainService,
        protected _sanitizer   : DomSanitizer,
        protected router       : Router,
        protected mapsAPILoader  : MapsAPILoader,
        protected ngZone         : NgZone,
        private ref: ChangeDetectorRef
    ){
        super(main,_sanitizer,router,mapsAPILoader,ngZone);
    }
    ngOnInit(): void  {
        this.Init();
    }
    

    public Init(acc?:AccountGetModel){
        this.render = true;
        if(acc){
            this.Account = acc;
        }
        this.GetTickets();
        this.GetEvents();
        this.GetFolowersAcc();

        if(this.Account.image_id)
        {
            
            this.WaitBeforeLoading(
                () => this.main.imagesService.GetImageById(this.Account.image_id),
                (res:Base64ImageModel)=>{
                    console.log(res);
                    this.Account.image_base64 = res.base64;
                }
            );
        }

        this.MyAccountId = this.GetCurrentAccId();
        if(this.MyAccountId == this.Account.id){
            this.isMyAccount = true;
        }
        else{
            let my = this.MyAccounts.find(obj => obj.id == this.Account.id);
        
            if(my){
                this.isMyAccount = true;
            }
            else{
                this.isFolowed();
            }
        }
        this.ref.detectChanges();
        this.render = false;
    }

    GetEvents()
    {
        
        this.WaitBeforeLoading(
            () => this.main.eventService.GetEvents(this.Account.id),
            (res:EventGetModel[]) => {
                this.EventsMassChecked = this.convertArrToCheckModel<EventGetModel>(res);
                for(let it of this.EventsMassChecked){
                    it.checked = true;
                }
                console.log(this.EventsMassChecked);
            },
            (err) => {
                console.log(err);
            }
        );
    }

    GetTickets()
    {
        this.WaitBeforeLoading(
            () => this.main.eventService.GetAllTicketswithoutCurrent(this.Account.id),
            (res:TicketsGetModel[]) =>
            {
                this.ticketsMassChecked = this.convertArrToCheckModel<TicketsGetModel>(res);
                for(let it of this.ticketsMassChecked){
                    it.checked = true;
                }
                this.CountTotaltTicket();
            },
            (err) => {
                console.log(err);
            }
        );
    }
    CountTotaltTicket()
    {
        this.TotalTicket = 0;
        for(let i of this.ticketsMassChecked)
        {
            this.TotalTicket+=i.object.tickets_count;
        }
    }
    GetFolowersAcc()
    {
        this.FolowersMass = [],this.folowersMassChecked = [];
        this.WaitBeforeLoading(
            () => this.main.accService.GetAcauntFolowers(this.Account.id),
            (res:any) =>
            {
                this.FolowersMass = res.followers;
                this.searchFolover({target:{value:null}});  
               console.log(this.folowersMassChecked)
            
            },
            (err) => {
                console.log(err);
            
            }
        );
    }
    searchFolover(event)
    {
        let searchParam = event.target.value;
        if(searchParam){
            this.folowersMassChecked = this.FolowersMass.filter(obj=> obj.user_name.indexOf(searchParam)>=0);
        }
        else{
            this.folowersMassChecked = this.FolowersMass;
        }
        

    }
    searchTickets(event)
    {
        let searchParam = event.target.value;
        for(let it of this.ticketsMassChecked)
        {
            if(it.object.name.indexOf(searchParam)>=0)
            {
                it.checked = true;
            }
            else
            {
                it.checked = false;
            }
        }
    }
    searchEvents(event)
    {
        let searchParam = event.target.value;
        for(let it of this.EventsMassChecked)
        {
            if(it.object.name.indexOf(searchParam)>=0)
            {
                it.checked = true;
            }
            else
            {
                it.checked = false;
            }
        }
    }
        
    FollowProfile() {
        this.WaitBeforeLoading(
        () => this.main.accService.FollowAccountById(this.MyAccountId, this.Account.id),
        (res:any) =>
        { 
        
            this.isFolowed();
        },
        (err) => {
            console.log(err);
        
        }
    );
    
    }
    UnFollowProfile() {
        this.WaitBeforeLoading(
            () => this.main.accService.UnFollowAccountById(this.MyAccountId, this.Account.id),
            (res:any) =>
            { 
                
                this.isFolowed();
            },
            (err) => {
                console.log(err);
            
            }
        );
    
    }
    
    isFolowed() {
        this.WaitBeforeLoading(
            () => this.main.accService.IsAccFolowed(this.MyAccountId, this.Account.id),
            (res:any) =>
            { 
                this.isFolowedAcc = res.status;
            },
            (err) => {
                console.log(err);
            }
        );
    }
}

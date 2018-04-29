import { Component, OnInit, NgZone, Input } from '@angular/core';
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
    selector: 'app-artist-profile',
    templateUrl: './artist-profile.component.html',
    styleUrls: ['./artist-profile.component.css']
})
export class ArtistProfileComponent  extends BaseComponent implements OnInit {
    @Input() IsPreview: any;
    @Input() Account: any;
    MyAccountId:number;
    UserId:number;
    SearchParams: AccountSearchParams = new AccountSearchParams();
    isMyAccount = false;
    Videos:SafeResourceUrl[] = [];
    FolowersMass:any = [];
    folowersMassChecked:CheckModel<any>[] = [];
    UpcomingShows:CheckModel<EventGetModel>[] = [];
    Albums:CheckModel<Album>[] = [];
    isFolowedAcc:boolean;
    constructor
    (           
        protected main         : MainService,
        protected _sanitizer   : DomSanitizer,
        protected router       : Router,
        protected mapsAPILoader  : MapsAPILoader,
        protected ngZone         : NgZone,
        private activatedRoute : ActivatedRoute
    ){
        super(main,_sanitizer,router,mapsAPILoader,ngZone);
    }
    ngOnInit(): void  {
        this.Init();

    }
    public Init(acc?:AccountGetModel){
        if(acc){
            this.Account = acc;
        }
        this.GetFolowersAcc();
        this.GetUpcomingShows();
        this.Albums = this.convertArrToCheckModel<Album>(this.Account.artist_albums);
        for(let it of this.Albums){
            it.checked = true;
        }
    
        this.MyAccountId = this.GetCurrentAccId();
        if(this.MyAccountId == this.Account.id){
            this.isMyAccount = true;
        }
        else{
            let my = this.main.GetMyAccounts().find(obj => obj.id == this.Account.id);
        
            if(my){
                this.isMyAccount = true;
            }
            else{
                this.isFolowed();
            }
        }
        this.main.accService.GetVideoArr(
            (data:SafeResourceUrl[]) => {
                this.Videos = data;
            },
            ()=>{
                this.InitSliderWrapp();
            }
        );
    }
    GetFolowersAcc()
    {
        this.WaitBeforeLoading(
            () => this.main.accService.GetAcauntFolowers(this.Account.id),
            (res:any) =>
            {
                this.folowersMassChecked = this.convertArrToCheckModel<any>(res.followers);
                for(let it of this.folowersMassChecked)
                {
                    it.checked = true;
                }
            
            },
            (err) => {
                console.log(err);
            
            }
        );
    }
    GetUpcomingShows(){
        this.WaitBeforeLoading(
            () => this.main.accService.GetUpcomingShows(this.Account.id),
            (res:any) =>
            { 
                this.UpcomingShows = this.convertArrToCheckModel<any>(res);
                for(let it of this.UpcomingShows){
                    it.checked = true;
                }
            },
            (err) => {
                console.log(err);
            
            }
        );
    }
    searchUpcomingShows(event)
    {
        let searchParam = event.target.value;
        for(let it of this.UpcomingShows)
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
    searchFolover(event)
    {
        let searchParam = event.target.value;
        for(let it of this.folowersMassChecked)
        {
            if(it.object.user_name.indexOf(searchParam)>=0)
            {
                it.checked = true;
            }
            else
            {
                it.checked = false;
            }
        }
    }
    searchAlboms(event)
    {
        let searchParam = event.target.value;
        for(let it of this.Albums)
        {
            if(it.object.album_name.indexOf(searchParam)>=0)
            {
                it.checked = true;
            }
            else
            {
                it.checked = false;
            }
        }
    }
    InitSliderWrapp() 
    {
        let that = this;
        $('.iframe-slider-wrapp').slick({
            dots: false,
            arrows: true,
            infinite: false,
            slidesToShow: 1

        });
        $('.iframe-slider-wrapp').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
            
            currentSlide = nextSlide;
        });
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

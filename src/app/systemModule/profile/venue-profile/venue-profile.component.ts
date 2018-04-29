import { Component, OnInit, NgZone, Input } from '@angular/core';
import { TicketsGetModel } from '../../../core/models/ticketsGetModel';
import { AccountType, BaseImages } from '../../../core/base/base.enum';
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
declare var PhotoSwipeUI_Default:any;
declare var PhotoSwipe:any;

@Component({
    selector: 'app-venue-profile',
    templateUrl: './venue-profile.component.html',
    styleUrls: ['./venue-profile.component.css']
})
export class VenueProfileComponent extends BaseComponent implements OnInit {
    @Input() IsPreview: any;
    @Input() Account: any;
    MyAccountId:number;
    isMyAccount = false;
    FolowersMass:any = [];
    folowersMassChecked:CheckModel<any>[] = [];
    UpcomingShows:CheckModel<EventGetModel>[] = [];
    itemsPhotoss:any = [];
    VenueImages:any;
    ImageMassVenue:any = [];
    imagesSize:Base64ImageModel[] = [];
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
      
        this.Account.office_hours = this.main.accService.ParseWorkingTimeModelArr(this.Account.office_hours);
        this.Account.operating_hours = this.main.accService.ParseWorkingTimeModelArr(this.Account.operating_hours);
        this.GetUpcomingShows();
        this.GetVenueImages();
        this.GetFolowersAcc();
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
    }
    Gallery(event) 
    {
        let itemsPhoto = [];
        $('.for-gallery-item').each(function (e) {
            var href = $(this).attr('data-hreff')
                , size = $(this).data('size').split('x')
                , width = size[0]
                , height = size[1];
            var item = {
                src: href
                , w: width
                , h: height
            }
            itemsPhoto.push(item);

        });
        this.itemsPhotoss = itemsPhoto;
        this.GalaryInit(event);   
    }
    GalaryInit(event)
    {
        var index = event.srcElement.dataset.eteration;
        var options = {
            index: parseInt(index),
            bgOpacity: 1,
            showHideOpacity: true,
            history: false,
        }
        var lightBox = new PhotoSwipe($('.pswp')[0], PhotoSwipeUI_Default, this.itemsPhotoss, options);
        lightBox.init();
    }
    GetVenueImages()
    {
        this.WaitBeforeLoading(
            () => this.main.accService.GetImagesVenue(this.Account.id),
            (res:any) => {
                this.VenueImages = this.convertArrToCheckModel<any>(res.images);
                for(let it of this.VenueImages){
                    it.checked = true;
                }
                this.GetImage();
                this.GetImageSize();
                
            },
            (err) => {
                console.log(err);
            }
        );
    }
    GetImage()
    {
        for(let i in this.VenueImages){
            if(this.VenueImages[i].object && this.VenueImages[i].object.id)
            {
                this.WaitBeforeLoading(
                    () => this.main.imagesService.GetImageById(this.VenueImages[i].object.id),
                    (res:Base64ImageModel) => {
                        this.ImageMassVenue[i] = (res && res.base64) ? res.base64 : BaseImages.Drake;
                    },
                    (err) =>{
                        this.ImageMassVenue[i] = BaseImages.Drake;
                    }
                );
            }
            else{
                this.ImageMassVenue[i] = BaseImages.Drake;
            }
        }
    }
    GetImageSize()
    {
        for(let i in this.VenueImages){
            this.WaitBeforeLoading(
                () => this.main.imagesService.GetImageSize(this.VenueImages[i].object.id),
                (res:Base64ImageModel) => {
                    this.imagesSize[i] = res;
                    console.log(this.imagesSize);
                },
                (err) =>{
                    console.log(err);
                }
            );
        }
    }

    searchImagesVenue(event){
        let searchParam = event.target.value;
        for(let it of this.VenueImages){
            if(it.object.description.indexOf(searchParam)>=0){
                it.checked = true;
            }
            else{
                it.checked = false;
            }
        }
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

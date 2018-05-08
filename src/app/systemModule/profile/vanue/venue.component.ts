import { Component, OnInit, OnChanges, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { BaseComponent } from "../../../core/base/base.component";
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { TicketsGetModel } from "../../../core/models/ticketsGetModel";
import { EventGetModel } from "../../../core/models/eventGet.model";
import { Base64ImageModel } from "../../../core/models/base64image.model";
import { BaseImages } from "../../../core/base/base.enum";
import { AccountCreateModel } from "../../../core/models/accountCreate.model";

declare var $:any;
declare var PhotoSwipeUI_Default:any;
declare var PhotoSwipe:any;

@Component({
    selector: 'venue-profile-selector',
    templateUrl: './venue.component.html',
    styleUrls: [
        './../profile.component.css'
    ]
})


export class VenueProfileComponent extends BaseComponent implements OnInit,OnChanges {
    
    @Input() Account: AccountGetModel;
    @Input() Image:string;
    @Input() Fans:AccountGetModel[];
    @Input() IsMyAccount:boolean;
    @Input() isFolowedAcc:boolean;
    @Input() IsPreview:boolean;
    @Input() Venue: AccountCreateModel;
    @Input() VenueId: number;
    @Output() onFollow:EventEmitter<boolean> = new EventEmitter<boolean>();



    UpcomingShows:any [] = [];
    UpcomingShowsChecked:any [] = [];

    FansChecked:AccountGetModel[] = [];

    itemsPhotoss:any = [];
    VenueImages:any = [];
    VenueImagesChecked:any = [];
    ImageMassVenue:any = [];
    imagesSize:Base64ImageModel[] = [];

    OffHours: any[] = [];
    OpHours: any[] = [];
    

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.Account)
        {
            this.Account = changes.Account.currentValue;
        }
        
        if(changes.Fans)
            this.FansChecked = this.Fans = changes.Fans.currentValue;

        // console.log(this.Account);

        if(this.IsPreview){
            this.Init(changes.Venue.currentValue,changes.VenueId.currentValue);
        }
        this.InitByUser();
    }

    ngOnInit(): void {
        this.InitByUser();
    }

    Init(venue?:AccountCreateModel,id?:number)
    {
        if(venue)
            this.Venue = venue;
        if(id)
            this.VenueId = id;

           
        this.GetVenueImagesPreview();
    }

    InitByUser()
    {
        this.OpHours = [];
        this.OffHours = [];
        if(this.IsPreview)
        {
            if(this.Account.office_hours)
                this.OffHours = this.main.accService.ParseWorkingTimeModelArr(this.Account.office_hours);
            
            if(this.Account.operating_hours)
                this.OpHours = this.main.accService.ParseWorkingTimeModelArr(this.Account.operating_hours);
        }
        else{
            if(this.Account.office_hours)
                this.OffHours = this.main.accService.ParseWorkingTimeModelArr(this.Account.office_hours);
        
            if(this.Account.operating_hours)
                this.OpHours = this.main.accService.ParseWorkingTimeModelArr(this.Account.operating_hours);;
        }
        // this.Account.office_hours = (this.Account && this.Account.office_hours)?
        //     this.main.accService.ParseWorkingTimeModelArr(this.Account.office_hours):[];
        // this.Account.operating_hours = (this.Account && this.Account.operating_hours)?
        //     this.main.accService.ParseWorkingTimeModelArr(this.Account.operating_hours):[];
        
        this.GetUpcomingShows();
        this.GetVenueImages();
    }

    searchFans(event)
    {
        let searchParam = event.target.value;
        if(searchParam)
            this.FansChecked = this.Fans.filter(obj => obj.user_name.indexOf(searchParam)>=0);
        else this.FansChecked = this.Fans;
    }

    GetUpcomingShows(){
        if(this.Account.id)
        {
            this.WaitBeforeLoading(
                () => this.main.accService.GetUpcomingShows(this.Account.id),
                (res:any) =>
                { 
                    this.UpcomingShowsChecked = this.UpcomingShows = res;
                },
                (err) => {
                //  console.log(err);
                
                }
            );
        }
        else{
            this.UpcomingShowsChecked = this.UpcomingShows = [];
        }
    }
    searchUpcomingShows(event)
    {
        let searchParam = event.target.value;
        if(searchParam)
            this.UpcomingShowsChecked = this.UpcomingShows.filter(obj => obj.name && obj.name.indexOf(searchParam)>=0);
        else this.UpcomingShowsChecked = this.UpcomingShows;
    }


    FollowProfile(event:boolean)
    {
        this.onFollow.emit(event);
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
    GetVenueImagesPreview()
    {
        this.VenueImages = this.VenueImagesChecked = [];
        if(this.VenueId)
        {
            this.WaitBeforeLoading(
                () => this.main.accService.GetImagesVenue(this.VenueId),
                (res:any) => {
                    this.VenueImagesChecked = this.VenueImages = res.images;
                    this.GetImage();
                    this.GetImageSize();
                    
                },
                (err) => {
                // console.log(err);
                }
            );
        }
    }

    GetVenueImages()
    {
        this.VenueImages = this.VenueImagesChecked = [];
        if(this.Account.id)
        {
            this.WaitBeforeLoading(
                () => this.main.accService.GetImagesVenue(this.Account.id),
                (res:any) => {
                    this.VenueImagesChecked = this.VenueImages = res.images;
                    this.GetImage();
                    this.GetImageSize();
                    
                },
                (err) => {
                // console.log(err);
                }
            );
        }
    }
    GetImage()
    {
        for(let i in this.VenueImages){
            if(this.VenueImages[i]&& this.VenueImages[i].id)
            {
                this.WaitBeforeLoading(
                    () => this.main.imagesService.GetImageById(this.VenueImages[i].id),
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
                () => this.main.imagesService.GetImageSize(this.VenueImages[i].id),
                (res:Base64ImageModel) => {
                
                    this.imagesSize[i] = res;

                //  console.log(this.imagesSize);
                },
                (err) =>{
                // console.log(err);
                }
            );
        }
        
    }
    searchImagesVenue(event){
        let searchParam = event.target.value;
        console.log(this.VenueImages.filter(obj => obj.description && obj.description.indexOf(searchParam)>=0));
        if(searchParam)
            this.VenueImagesChecked = this.VenueImages.filter(obj => obj.description && obj.description.indexOf(searchParam)>=0);
        else this.VenueImagesChecked = this.VenueImages;
    }
}
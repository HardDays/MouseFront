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
    imagesSize:any[] = [];

    Lat:number = 0;
    Lng:number = 0;

    OffHours: any[] = [];
    OpHours: any[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.Account)
        {
            this.Account = changes.Account.currentValue;
        }
        
        if(changes.Fans)
            this.FansChecked = this.Fans = changes.Fans.currentValue;

        

        if(this.IsPreview){
            this.Init(changes.Venue.currentValue,changes.VenueId.currentValue);
        }
        
        this.InitByUser();
    }

    ngOnInit(): void {
        
    }

    Init(venue?:AccountCreateModel,id?:number)
    {
        if(venue)
            this.Venue = venue;
        if(id)
            this.VenueId = id;

        this.GetVenueImages();
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
                this.OpHours = this.main.accService.ParseWorkingTimeModelArr(this.Account.operating_hours);
        }

        this.Lat = this.Account.lat?this.Account.lat:0;
        this.Lng = this.Account.lng?this.Account.lng:0;
        console.log(this.Lat,this.Lng);
        
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

    GetVenueImages()
    {
        this.VenueImages = this.VenueImagesChecked = [];
        if(this.VenueId)
        {
            this.WaitBeforeLoading(
                () => this.main.accService.GetImagesVenue(this.VenueId),
                (res:any) => {
                    this.VenueImages = res.images;
                    this.GetImage();
                },
                (err) => {
                }
            );
        }
    }
    GetImage()
    {
        for(let i in this.VenueImages){
            if(this.VenueImages[i] && this.VenueImages[i].id)
            {
                this.WaitBeforeLoading(
                    () => this.main.imagesService.GetImageById(this.VenueImages[i].id),
                    (res:Base64ImageModel) => {
                        this.ImageMassVenue[i] = res;
                        this.VenueImagesChecked = this.ImageMassVenue;
                        this.GetImageSize(+i);
                    }
                );
            }
        }
        
    }
    GetImageSize(i:number)
    {
        if(this.VenueImages[i] && this.VenueImages[i].id)
        {
            this.WaitBeforeLoading(
                () => this.main.imagesService.GetImageSize(this.VenueImages[i].id),
                (res:any) => {
                    if(res)
                    {
                        if(res.width)
                            this.ImageMassVenue[i].width = res.width;
                        if(res.height)
                            this.ImageMassVenue[i].height = res.height;
                        if(res.url)
                            this.ImageMassVenue[i].url = res.url;
                    }
                    this.VenueImagesChecked = this.ImageMassVenue;
                },
                (err) =>{
                }
            );
        }
        
    }
    searchImagesVenue(event){
        let searchParam = event.target.value;
        if(searchParam)
            this.VenueImagesChecked = this.ImageMassVenue.filter(obj => obj.description && obj.description.indexOf(searchParam)>=0);
        else this.VenueImagesChecked = this.ImageMassVenue;
    }
}
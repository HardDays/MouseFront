import { Component, OnInit, OnChanges, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { BaseComponent } from "../../../core/base/base.component";
import { AccountGetModel, Album } from '../../../core/models/accountGet.model';
import { TicketsGetModel } from "../../../core/models/ticketsGetModel";
import { EventGetModel } from "../../../core/models/eventGet.model";
import { Base64ImageModel } from "../../../core/models/base64image.model";
import { BaseImages } from "../../../core/base/base.enum";
import { CheckModel } from "../../../core/models/check.model";
import { SafeResourceUrl } from "@angular/platform-browser";

declare var $:any;
declare var PhotoSwipeUI_Default:any;
declare var PhotoSwipe:any;

@Component({
    selector: 'artist-profile-selector',
    templateUrl: './artist.component.html',
    styleUrls: [
        './../profile.component.css'
    ]
})


export class ArtistProfileComponent extends BaseComponent implements OnInit,OnChanges {
    
    @Input() Account: AccountGetModel;
    @Input() Image:string;
    @Input() Fans:AccountGetModel[];
    @Input() IsMyAccount:boolean;
    @Input() isFolowedAcc:boolean;
    @Input() IsPreview:boolean;
    @Output() onFollow:EventEmitter<boolean> = new EventEmitter<boolean>();

    UpcomingShows:any [] = [];
    UpcomingShowsChecked:any [] = [];

    FansChecked:AccountGetModel[] = [];

    SomeFlagForSlider:boolean = true;
    Albums:Album[] = [];
    AlbumsChecked:Album[] = [];
    VideoPath:SafeResourceUrl[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.Account)
        {
            this.Account = changes.Account.currentValue;
        }
        
        if(changes.Fans)
            this.FansChecked = this.Fans = changes.Fans.currentValue;

        this.InitByUser();
        console.log('changes');
    }

    ngOnInit(): void {
        this.InitByUser();
        console.log('init');
    }

    InitByUser()
    {
        // this.Account.office_hours = (this.Account && this.Account.office_hours)?
        //     this.main.accService.ParseWorkingTimeModelArr(this.Account.office_hours):[];
        // this.Account.operating_hours = (this.Account && this.Account.operating_hours)?
        //     this.main.accService.ParseWorkingTimeModelArr(this.Account.operating_hours):[];

        
        this.AlbumsChecked = this.Albums = this.Account.artist_albums;
        if(this.SomeFlagForSlider){
         
            this.GetVideo();
            this.SomeFlagForSlider = false;
        }
        this.GetUpcomingShows();
    }

    GetVideo()
    {
        this.VideoPath = [];
        if(this.Account.videos && this.Account.videos.length > 0)
        {
        
            for(let i in this.Account.videos){
                let link = this.Account.videos[i].link;
                let id = this.GetVideoId(link);
                let path = id? ("https://www.youtube.com/embed/" + id) : "";
                if(path)
                {
                    this.VideoPath[i] = this.SanitizePath(path);
                }
            }
            // setTimeout(()=>{
            //     this.InitSliderWrapp();
            // },600);
        }
    }
    
    SanitizePath(path:string)
    {
        return this._sanitizer.bypassSecurityTrustResourceUrl(path);
    }

    GetVideoId(url:string)
    {
        let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return false;
        }
    }

    searchAlbums(event)
    {
        let searchParam = event.target.value;
        if(searchParam)
            this.AlbumsChecked = this.Albums.filter(obj => obj.album_name.indexOf(searchParam)>=0);
        else this.AlbumsChecked = this.Albums;
    }

    InitSliderWrapp() 
    {
  
        $('.iframe-slider-wrapp').not('.slick-initialized').slick({
            dots: false,
            arrows: true,
            infinite: false,
            slidesToShow: 1
        });
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

}
import { Component, OnInit, OnChanges, EventEmitter, Input, Output, SimpleChanges, ViewChild } from "@angular/core";
import { BaseComponent } from "../../../core/base/base.component";
import { AccountGetModel, Album } from '../../../core/models/accountGet.model';
import { TicketsGetModel } from "../../../core/models/ticketsGetModel";
import { EventGetModel } from "../../../core/models/eventGet.model";
import { Base64ImageModel } from "../../../core/models/base64image.model";
import { BaseImages } from "../../../core/base/base.enum";
import { CheckModel } from "../../../core/models/check.model";
import { SafeResourceUrl } from "@angular/platform-browser";
import { ErrorComponent } from "../../../shared/error/error.component";

declare var $:any;
declare var PhotoSwipeUI_Default:any;
declare var PhotoSwipe:any;
declare var SC:any;

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
    @Input() MyProfileId: number;
    @Output() onFollow:EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('errorCmp') errorCmp: ErrorComponent;

    UpcomingShows:any [] = [];
    UpcomingShowsChecked:any [] = [];

    FansChecked:AccountGetModel[] = [];
    Genres: string[] = [];
    SomeFlagForSlider:boolean = true;
    Albums:Album[] = [];
    AlbumsChecked:Album[] = [];
    VideoPath:SafeResourceUrl[] = [];

    audioId:number = 0;
    audioDuration:number = 0;
    audioCurrentTime:number = 0;
    player:any;
    countAudio = 6;

    

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.Account)
        {
            this.Account = changes.Account.currentValue;
            this.GetGenres();
        }
        if(changes.MyProfileId){
            this.MyProfileId = changes.MyProfileId.currentValue;
        }
        if(changes.Fans){
            this.FansChecked = this.Fans = changes.Fans.currentValue;
        }
        // if(changes.Image){
        //     this.Image = changes.Image.currentValue;
        // }
        this.InitByUser();
    }

    ngOnInit(): void {
        this.InitByUser();
        SC.initialize({
            client_id: "b8f06bbb8e4e9e201f9e6e46001c3acb",
        });
       
    }

    InitByUser()
    {
        // this.Account.office_hours = (this.Account && this.Account.office_hours)?
        //     this.main.accService.ParseWorkingTimeModelArr(this.Account.office_hours):[];
        // this.Account.operating_hours = (this.Account && this.Account.operating_hours)?
        //     this.main.accService.ParseWorkingTimeModelArr(this.Account.operating_hours):[];

        
        this.AlbumsChecked = this.Albums = this.Account.artist_albums;
    
        // this.GetVideo();
        this.GetUpcomingShows();
        
    }

    GetGenres(){
        if(this.Account.genres)
            this.Account.genres = this.main.genreService.BackGenresToShowGenres(this.Account.genres);
    }

    // GetImage(){
    //     if (this.Account.image_id) {
    //         this.main.imagesService.GetImageById(this.Account.image_id)
    //             .subscribe((res) => {
    //                 this.Account.image_base64_not_given = res.base64;
    //             });
    //     }
    // }
    // GetVideo()
    // {
    //     this.VideoPath = [];
    //     if(this.Account.videos && this.Account.videos.length > 0)
    //     {
        
    //         for(let i in this.Account.videos){
    //             let link = this.Account.videos[i].link;
    //             let id = this.GetVideoId(link);
    //             let path = id? ("https://www.youtube.com/embed/" + id) : "";
    //             if(path)
    //             {
    //                 this.VideoPath[i] = this.SanitizePath(path);
    //             }
    //         }
    //         if(!$('.iframe-slider-wrapp').not('.slick-initialized').length){
    //             $('.iframe-slider-wrapp').slick('unslick');
    
    //         }
    //         setTimeout(()=>{
    //             this.InitSliderWrapp();
    //         },1000);
    //     }
    // }
    
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

    // InitSliderWrapp() 
    // {
        
    //     if($('.iframe-slider-wrapp').not('.slick-initialized').length){
    //         $('.iframe-slider-wrapp').slick({
    //             dots: false,
    //             arrows: true,
    //             infinite: false,
    //             slidesToShow: 1
    //         });

    //     }
    //     //если да
    // }


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

    playAudio(s:string){
  
        if(this.player&&  this.player.isPlaying())
          this.player.pause();
    
        console.log(s);
        this.audioDuration = 0;
        this.audioCurrentTime = 0;
        SC.resolve(s).then((res)=>{
          console.log(res);
          SC.stream('/tracks/'+res.id).then((player)=>{
            this.player = player;
            this.player.play();
      
            player.on('play-start',()=>{
              this.audioDuration = this.player.getDuration();
            })
            
            setInterval(()=>{
               this.audioCurrentTime = this.player.currentTime();
            },100)

            player.on('no_streams',()=>{
                console.log(`audio_error`);
                this.errorCmp.OpenWindow(`<b>Warning:</b> uploaded song is not free! It will be impossible to play it!`);
                
            })
            
            // setTimeout(()=>{
            //   player.pause()
            //   player.seek(0)
            // },10000)
      
          });
    
        },(err)=>{
            this.errorCmp.OpenWindow(`<b>Warning:</b> uploaded song is not free! It will be impossible to play it!`);
            console.log(`ERROR`)
        })
      }
    
      stopAudio(){
        if(this.player&&!this.player.isDead())
            this.player.pause();
      }

}
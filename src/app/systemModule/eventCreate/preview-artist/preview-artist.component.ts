import { Component, OnInit, Input, AfterViewInit, SimpleChanges, Output, EventEmitter, NgZone, ChangeDetectorRef } from '@angular/core';
import { AccountGetModel, Video } from '../../../core/models/accountGet.model';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { BaseImages } from '../../../core/base/base.enum';
import * as moment from 'moment';
import { Base64ImageModel } from '../../../core/models/base64image.model';
import { TinyCalendarComponent, CalendarDate } from './tiny-calendar/tiny-calendar.component';
import { CurrencyIcons, Currency } from '../../../core/models/preferences.model';


declare var audiojs:any;
declare var $:any;
declare var PhotoSwipeUI_Default:any;
declare var PhotoSwipe:any;
declare var SC:any;

@Component({
  selector: 'app-preview-artist',
  templateUrl: './preview-artist.component.html',
  styleUrls: ['./preview-artist.component.css']
})
export class PreviewArtistComponent extends BaseComponent implements OnInit {

 
  @Input() ArtistId:number;
  @Output() OnReturn = new EventEmitter();

  VenueImages:any;

  itemsPhotoss:any = [];

  photos:any = [];

  audioId:number = 0;
  audioDuration:number = 0;
  audioCurrentTime:number = 0;
  player:any;
  countAudio = 6;
  canScrolling:boolean = false;
  startMouseX:number;
  openVideoLink:any;
  isVideoOpen:boolean = false;

  DisabledDates: CalendarDate[] = [];
  EventDates: CalendarDate[] = [];

  Artist:AccountGetModel = new AccountGetModel();

  CurrencySymbol = CurrencyIcons[Currency.USD];

  onHover:boolean[] = [true,false,false,false];

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

  ngOnInit() {
    // this.CurrencySymbol = CurrencyIcons[this.main.settings.GetCurrency()];

    scrollTo(0,0);
    this.InitMusicPlayer();

    this.WaitBeforeLoading(
      ()=>this.main.accService.GetAccountById(this.ArtistId),
      (res:AccountGetModel)=>{
        this.Artist = res;
        if(this.Artist.genres)
          this.Artist.genres = this.main.genreService.BackGenresToShowGenres(this.Artist.genres);
        // console.log(`artist`,res);
        this.CurrencySymbol = CurrencyIcons[this.Artist.currency];
        this.GetDates();
        this.GetArtistImages();
        this.updateVideosPreview();
        
       // if(changes['ArtistId'].isFirstChange()) this.InitMusicPlayer();
        if(res.image_id){
         this.main.imagesService.GetImageById(res.image_id)
           .subscribe((img)=>{
             this.Artist.image_base64_not_given = img.base64;
           });
         }
         else this.Artist.image_base64_not_given = BaseImages.NoneFolowerImage;
         this.positionScroller();
      }
     )
  }

  ngAfterViewInit(){
    this.positionScroller();
        
    
    
      
  
  // this.InitMusicPlayer();
  }

  positionScroller(){
    
    setTimeout(() => {
      if($(window).width() >= 768){
        $('.photos-abs-wrapp').css({
          'max-height': $('.rel-wr-photoos').width()+'px'
        });
        $('.new-photos-wr-scroll-preview').css({
          'padding-left': $('.for-position-left-js').offset()?$('.for-position-left-js').offset().left:0
        });
    
      $(window).resize(function(){
          $('.photos-abs-wrapp').css({
              'max-height': $('.rel-wr-photoos').width()+'px'
          });
          $('.new-photos-wr-scroll-preview').css({
              'padding-left': $('.for-position-left-js').offset()?$('.for-position-left-js').offset().left:0
          });
      });
    }
    else{
      $('.new-photos-wr-scroll-preview').css({
        'padding-left': '15px'
      });
      $('.photos-abs-wrapp').css({
        'max-height': ($('.rel-wr-photoos').width()) +'px'
      });
     
  
      $(window).resize(function(){
        $('.new-photos-wr-scroll-preview').css({
            'padding-left': '15px'
        });
          $('.photos-abs-wrapp').css({
              'max-height': ($('.rel-wr-photoos').width())+'px'
          });
          
      });
    }
  }, 2500);
  }


  InitMusicPlayer(){
    // setTimeout(() => {
    //   var as = audiojs.createAll();
    //  }, 500);
    SC.initialize({
      client_id: "b8f06bbb8e4e9e201f9e6e46001c3acb",
    });
  }

  GetDates(){
    if(this.Artist){
      if(this.Artist.events_dates)
        for(let date of this.Artist.events_dates){
          if(date.date)
          this.EventDates.push({
            mDate: moment(date.date.split("T")[0]),
            eventId: date.event_id 
            
          });
        }
      if(this.Artist.disable_dates)
        for(let date of this.Artist.disable_dates){
          if(date.date)
          this.DisabledDates.push({
            mDate: moment(date.date.split("T")[0])
          });
        }
    }
  }



  backPage(){
    this.OnReturn.emit();
  }

  GetArtistImages(){
    this.photos = [];
    this.main.accService.GetImagesVenue(this.Artist.id)
    .subscribe((im)=>{
      for(let oneRes of im.images)
      this.WaitBeforeLoading(
        () => this.main.imagesService.GetImageById(oneRes.id),
        (res:any) => {
             let p = {
              id:res.id,
              base64:res.base64,
              size: {width:500,height:500}
            };
            this.main.imagesService.GetImageSize(p.id)
              .subscribe((res:any) => {
                p.size.width = res.width;
                p.size.height = res.height;
            },
              (err) =>{
            });
            this.photos.push(p);
            this.positionScroller();
            // console.log(`photos2`,this.photos);  
          },
        (err) => {
        }
    );
    });
  }


  Gallery(index) 
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
        this.GalaryInit(index);   
    }

    GalaryInit(index)
    {
        var index = index;
        var options = {
            index: parseInt(index),
            bgOpacity: 1,
            showHideOpacity: true,
            history: false,
        }
        var lightBox = new PhotoSwipe($('.pswp')[0], PhotoSwipeUI_Default, this.itemsPhotoss, options);
        lightBox.init();
    }

    scrollTo(part:string){
      let page = '#'+part+'Page';
      $('html, body').animate({
        scrollTop: $(page).offset().top
      }, 1000);
      
    }

    playAudio(s:string){
  
      if(this.player&&  this.player.isPlaying())
        this.player.pause();
  
      // console.log(s);
      this.audioDuration = 0;
      this.audioCurrentTime = 0;
      SC.resolve(s).then((res)=>{
        // console.log(res);
        SC.stream('/tracks/'+res.id).then((player)=>{
          this.player = player;
          this.player.play();
    
          player.on('play-start',()=>{
            this.audioDuration = this.player.getDuration();
          })
          
          setInterval(()=>{
             this.audioCurrentTime = this.player.currentTime();
          },100)
          
          // setTimeout(()=>{
          //   player.pause()
          //   player.seek(0)
          // },10000)
    
        });
  
      },(err)=>{
        // console.log(`ERROR`)
      })
    }
  
    stopAudio(){
      this.player.pause();
    }

    openVideo(video:Video){

      let video_id ='';
      if(video.link.indexOf('youtube') !== -1){
        video_id = video.link.split('v=')[1];
  
      }
      if(video.link.indexOf('youtu.be') !== -1){
        video_id = video.link.split('.be/')[1];
      }
  
  
      this.openVideoLink = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+video_id+'?rel=0');
      this.isVideoOpen = true;
  
      setTimeout(()=>{
        $('#modal-movie').modal('show');
        $('#modal-movie').on('hidden.bs.modal', () => {
          this.isVideoOpen = false;
        })
      },100);
    }

    updateVideosPreview(){

      for(let video of this.Artist.videos){
        let video_id ='';
  
        if(video.link.indexOf('youtube')!== -1)
          video_id = video.link.split('v=')[1];
        if(video.link.indexOf('youtu.be')!== -1)
          video_id = video.link.split('be/')[1];
  
        video.preview = 'https://img.youtube.com/vi/'+video_id+'/0.jpg';
      }
    }




}

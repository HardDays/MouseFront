import { Component, OnInit, Input, SimpleChanges, EventEmitter, ViewChild, Output, HostListener } from '@angular/core';
import { BaseComponent } from '../../../../core/base/base.component';
import { AccountGetModel, Video, Rider } from '../../../../core/models/accountGet.model';
import { GenreModel } from '../../../../core/models/genres.model';
import { CalendarDate } from '../../../../systemModule/artistCreate/tiny-calendar/tiny-calendar.component';
import * as moment from 'moment';
import { BaseImages } from '../../../../core/base/base.enum';
import { ErrorComponent } from '../../../../shared/error/error.component';

declare var $:any;
declare var PhotoSwipeUI_Default:any;
declare var PhotoSwipe:any;
declare var SC:any;

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent extends BaseComponent implements OnInit {

  // @ViewChild('errorCmp') errorCmp:ErrorComponent;
  @Input() Account:AccountGetModel;
  @Input() CurrencySymbol:string;

  @Output() onError = new EventEmitter<string>();

  Genres:string[] = [];

  DisabledDates: CalendarDate[] = [];
  EventDates: CalendarDate[] = [];

  itemsPhotoss:any = [];

  photos:any = [];

  audioId:number = 0;
  audioDuration:number = 0;
  audioCurrentTime:number = 0;
  player:any;
  countAudio = 6;

  openVideoLink:any;
  isVideoOpen:boolean = false;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if(this.isShowMap){
        if (event.keyCode === this.ESCAPE_KEYCODE || event.keyCode === this.ENTER_KEYCODE) {
          $('#modal-map-1').modal('hide');
          this.isShowMap = false;
        }
    }
  }

  isShowMap = false;


  ESCAPE_KEYCODE = 27;
  ENTER_KEYCODE = 13;

  ngOnInit() {

    if(this.Account.image_id)
      this.Account.image_base64_not_given = this.main.imagesService.GetImagePreview(this.Account.image_id,{width:900,height:500});
    else
      this.Account.image_base64_not_given = BaseImages.NoneFolowerImage;
    this.Genres = this.main.genreService.BackGenresToShowGenres(this.Account.genres);

    this.GetDates();
    this.GetArtistImages();
    this.updateVideosPreview();
    this.InitMusicPlayer();
  }

  ngOnChanges(change: SimpleChanges){
    if(change.Account){
      if(this.Account.image_id)
        this.Account.image_base64_not_given = this.main.imagesService.GetImagePreview(this.Account.image_id,{width:900,height:500});
      else
        this.Account.image_base64_not_given = BaseImages.NoneFolowerImage;
    }
  }

  GetDates(){
    if(this.Account){
      if(this.Account.events_dates)
        for(let date of this.Account.events_dates){
          if(date.date)
          this.EventDates.push({
            mDate: moment(date.date.split("T")[0]),
            eventId: date.event_id

          });
        }
      if(this.Account.disable_dates)
        for(let date of this.Account.disable_dates){
          if(date.date)
          this.DisabledDates.push({
            mDate: moment(date.date.split("T")[0])
          });
        }
    }
  }




  ngAfterViewInit(){
    this.AddScrollToImages();

  }
  AddScrollToImages(){
    setTimeout(() => {
      $('.photos-abs-wrapp').css({
        'max-height': $('.rel-wr-photoos').width()+'px'
      });


    $(window).resize(function(){
        $('.photos-abs-wrapp').css({
            'max-height': $('.rel-wr-photoos').width()+'px'
        });

    });
    }, 2000);
  }


  GetArtistImages(){
    this.photos = [];
    this.main.accService.GetImagesVenue(this.Account.id)
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
                this.AddScrollToImages();
            },
              (err) =>{
            });
            this.photos.push(p);
            // console.log(`photos2`,this.photos);
          },
        (err) => {
        }
    );
    });
  }

  Gallery(index){
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

  GalaryInit(index){
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




  InitMusicPlayer(){
    // setTimeout(() => {
    //   var as = audiojs.createAll();
    //  }, 500);
    SC.initialize({
      client_id: "b8f06bbb8e4e9e201f9e6e46001c3acb",
    });
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
        // console.log(`PLAYING`);

        player.on('play-start',()=>{
          // console.log(`start play`);
          this.audioDuration = this.player.getDuration();

          setInterval(()=>{
            this.audioCurrentTime = this.player.currentTime();
          },100)
        },(err)=>{
          this.onError.emit(`<b>Warning:</b> uploaded song is not free! It will be impossible to play it!`);
          // this.errorCmp.OpenWindow(`<b>Warning:</b> uploaded song is not free! It will be impossible to play it!`);
          // console.log(`not start play`);
        })

        player.on('no_streams',()=>{
          // console.log(`audio_error`);
          // this.errorCmp.OpenWindow(`<b>Warning:</b> uploaded song is not free! It will be impossible to play it!`);
          this.onError.emit(`<b>Warning:</b> uploaded song is not free! It will be impossible to play it!`);

        })



        // setTimeout(()=>{
        //   player.pause()
        //   player.seek(0)
        // },10000)

      },(err)=>{
        // this.errorCmp.OpenWindow(`<b>Warning:</b> uploaded song is not free! It will be impossible to play it!`);
        this.onError.emit(`<b>Warning:</b> uploaded song is not free! It will be impossible to play it!`);
        // console.log(`error streaming`,err)
      });

    },(err)=>{
      // this.errorCmp.OpenWindow(`<b>Warning:</b> uploaded song is not free! It will be impossible to play it!`);
      this.onError.emit(`<b>Warning:</b> uploaded song is not free! It will be impossible to play it!`);
      // console.log(`ERROR`)
    })
  }

  stopAudio(){
    if(this.player&&!this.player.isDead())
    this.player.pause();
  }


  updateVideosPreview(){
    for(let video of this.Account.videos){
      let video_id ='';

      if(video.link.indexOf('youtube')!== -1)
        video_id = video.link.split('v=')[1];
      if(video.link.indexOf('youtu.be')!== -1)
        video_id = video.link.split('be/')[1];

      video.preview = 'https://img.youtube.com/vi/'+video_id+'/0.jpg';
      this.AddScrollToImages();
    }
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


  downloadRider(rider:Rider){
    this.main.accService.GetRiderById(rider.id)
    .subscribe((res)=>{
      if(res.uploaded_file_base64){
        let type = res.uploaded_file_base64.split(';base64,')[0];
        let file = res.uploaded_file_base64.split(';base64,')[1];
        var blob = new Blob([file], { type: type });
        var url = window.URL.createObjectURL(blob);
        window.open(url);
      }
      else {
        console.log(`No file`);
      }
    }, (err)=>{
      console.log(err);
    })
  }

  openMap(){
    $('#modal-map-1').modal('show');
    this.isShowMap = true;
  }



}

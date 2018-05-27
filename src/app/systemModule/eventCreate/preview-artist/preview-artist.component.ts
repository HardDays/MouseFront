import { Component, OnInit, Input, AfterViewInit, SimpleChanges, Output, EventEmitter, NgZone, ChangeDetectorRef } from '@angular/core';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { BaseImages } from '../../../core/base/base.enum';
import { Base64ImageModel } from '../../../core/models/base64image.model';


declare var audiojs:any;
declare var $:any;
declare var PhotoSwipeUI_Default:any;
declare var PhotoSwipe:any;

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

  Artist:AccountGetModel = new AccountGetModel();
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
    this.InitMusicPlayer();

    this.WaitBeforeLoading(
      ()=>this.main.accService.GetAccountById(this.ArtistId),
      (res:AccountGetModel)=>{
        this.Artist = res;
        this.GetArtistImages();
       // if(changes['ArtistId'].isFirstChange()) this.InitMusicPlayer();
        if(res.image_id){
         this.main.imagesService.GetImageById(res.image_id)
           .subscribe((img)=>{
             this.Artist.image_base64_not_given = img.base64;
           });
         }
         else this.Artist.image_base64_not_given = BaseImages.NoneFolowerImage;
      }
     )
  }

  ngAfterViewInit(){
    $('.photos-abs-wrapp').css({
      'max-height': $('.rel-wr-photoos').width()+'px'
  });
  $('.new-photos-wr-scroll-preview').css({
      'padding-left':$('.for-position-left-js').offset().left
  });

  $(window).resize(function(){
      $('.photos-abs-wrapp').css({
          'max-height': $('.rel-wr-photoos').width()+'px'
      });
      $('.new-photos-wr-scroll-preview').css({
          'padding-left':$('.for-position-left-js').offset().left
      });
  });

  
  // this.InitMusicPlayer();
  }

  InitMusicPlayer(){
    setTimeout(() => {
      var as = audiojs.createAll();
     }, 500);
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




}

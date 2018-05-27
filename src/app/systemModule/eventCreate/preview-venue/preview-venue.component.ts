import { Component, OnInit, EventEmitter, Output, Input, NgZone, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { BaseImages } from '../../../core/base/base.enum';

declare var $:any;

@Component({
  selector: 'app-preview-venue',
  templateUrl: './preview-venue.component.html',
  styleUrls: ['./preview-venue.component.css']
})
export class PreviewVenueComponent extends BaseComponent implements OnInit {

 
  @Input() VenueId:number;
  @Output() OnReturn = new EventEmitter();

  photos:any = [];

  Venue:AccountGetModel = new AccountGetModel();

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
    this.WaitBeforeLoading(
      ()=>this.main.accService.GetAccountById(this.VenueId),
      (res:AccountGetModel)=>{
        this.Venue = res;
        console.log(`venue`,this.Venue);
        if(res.image_id){
         this.main.imagesService.GetImageById(res.image_id)
           .subscribe((img)=>{
             this.Venue.image_base64_not_given = img.base64;
           });
         }
         else this.Venue.image_base64_not_given = BaseImages.NoneFolowerImage;

         this.getVenueImages();
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

  getVenueImages(){
      this.photos = [];
      this.main.accService.GetImagesVenue(this.Venue.id)
      .subscribe((im)=>{

        for(let oneRes of im.images)
        this.WaitBeforeLoading(
          () => this.main.imagesService.GetImageById(oneRes.id),
          (res:any) => {
            console.log(oneRes);
               let p = {
                id:res.id,
                base64:res.base64,
                size: {width:500,height:500},
                type: oneRes.type,
                description: oneRes.description
              };
              this.main.imagesService.GetImageSize(p.id)
                .subscribe((res:any) => {
                  p.size.width = res.width;
                  p.size.height = res.height;
              },
                (err) =>{
              });
              this.photos.push(p);
              console.log(this.photos); 
            },
          (err) => {
          }
      );
      });
  }


  toBeatyType(el:string){
    if(el)
      return el.replace('_',' ');
    else return '';
  }

  backPage(){
    this.OnReturn.emit();
  }

  scrollTo(part:string){
    let page = '#'+part+'Page';
    $('html, body').animate({
      scrollTop: $(page).offset().top
    }, 1000);
    
  }

}

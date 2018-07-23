import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../../core/base/base.component';
import { AccountGetModel } from '../../../../core/models/accountGet.model';
import { BaseImages } from '../../../../core/base/base.enum';

declare var $:any;

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent extends BaseComponent implements OnInit {

  @Input() Account:AccountGetModel;
  photos:any = [];

  ngOnInit() {
    if(this.Account.image_id){
      this.main.imagesService.GetImageById(this.Account.image_id)
        .subscribe(
          (img)=>{
            if(img.base64)
              this.Account.image_base64_not_given = img.base64;
            else 
              this.Account.image_base64_not_given = BaseImages.NoneFolowerImage;
          },
          (err)=>{
            console.log(err);
            this.Account.image_base64_not_given = BaseImages.NoneFolowerImage;
          });
      }
    else this.Account.image_base64_not_given = BaseImages.NoneFolowerImage;

    this.getVenueImages();
  }

  ngOnChanges(change: SimpleChanges){
    if(change.Account){
      if(this.Account.image_id){
        this.main.imagesService.GetImageById(this.Account.image_id)
          .subscribe(
            (img)=>{
              if(img.base64)
                this.Account.image_base64_not_given = img.base64;
              else 
                this.Account.image_base64_not_given = BaseImages.NoneFolowerImage;
            },
            (err)=>{
              console.log(err);
              this.Account.image_base64_not_given = BaseImages.NoneFolowerImage;
            });
        }
    }
  }

  ngAfterViewInit(){
    setTimeout(() => {
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
    }, 5000);
    

  
  // this.InitMusicPlayer();
  }

  getVenueImages(){
    this.photos = [];
    this.main.accService.GetImagesVenue(this.Account.id)
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

}

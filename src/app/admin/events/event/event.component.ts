import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { Params } from '@angular/router';
import { EventGetModel } from '../../../core/models/eventGet.model';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { BaseImages, BaseMessages } from '../../../core/base/base.enum';
import { Video } from '../../../core/models/accountCreate.model';
import { ErrorComponent } from '../../../shared/error/error.component';

declare var $:any;

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent extends BaseComponent implements OnInit {

  @ViewChild('errCmp') errCmp: ErrorComponent = new ErrorComponent(this.translate, this.settings);

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

  eventId = 0;
  Event:EventGetModel = new EventGetModel();

  Genres:string[] = [];

  Owner:AccountGetModel = new AccountGetModel();
  Artists:AccountGetModel[] = [];
  Videos:any[] = [];

  ngOnInit() {
    this.InitJs();


    this.activatedRoute.params.subscribe(
      (params:Params) => {
        this.eventId = params['id'];

        this.getThisEvent();
      }
    );
  }

  getThisEvent(){
    this.main.adminService.GetEventById(this.eventId)
    .subscribe(
      (res)=>{
        this.Event = res;
        this.eventId = this.Event.id;

        this.Genres = this.main.genreService.BackGenresToShowGenres(this.Event.genres);

        if(this.Event&&this.Event.id&&this.Event.image_id){
          this.Event.image_base64 = this.main.imagesService.GetImagePreview(this.Event.image_id,{width:900,height:700});
            // .subscribe(
            //   (img)=>{
            //     this.Event.image_base64 = img.base64;
            //   },
            //   (err)=>{
            //     this.Event.image_base64 = BaseImages.NoneFolowerImage;
            //   }
            // )
        }
        else{
          this.Event.image_base64 = BaseImages.NoneFolowerImage;
        }

        this.getCreator();
        this.getArtists();
      }
    )
  }

  getCreator(){
    if(this.Event.creator_id){
      this.main.accService.GetAccountById(this.Event.creator_id)
        .subscribe((acc)=>{

          this.Owner = acc;
        },(err)=>
        {
        })
    }
  }

  getArtists(){
    if(this.Event.artist.length>0){
      this.Artists = [];
      this.Videos = [];
      for(let art of this.Event.artist){
        if(art.status==='owner_accepted'){
          this.main.accService.GetAccountById(art.artist_id)
            .subscribe(
              (res)=>{
                this.Artists.push(res);
                if(res.videos.length>0){
                  for(let v of res.videos){
                    this.Videos.push(this.getLink(v.link));
                  }
                }
              }
            )
        }
      }
    }
  }

  InitJs(){
    setTimeout(() => {


      // $('.photos-abs-wrapp').css({
      //   'max-height': $('.rel-wr-photoos').width()+'px'
      // });

      // $(window).resize(function(){
      //     $('.photos-abs-wrapp').css({
      //         'max-height': $('.rel-wr-photoos').width()+'px'
      //     });
      // });

      if(this.Videos.length>0){
        $('.event_videos_slider').slick({
            dots: false,
            arrows: true,
            speed: 200

        });
      }
    }, 2500);

  }

  removeEvent(){
    this.main.adminService.EventDelete(this.eventId)
      .subscribe(
        (res)=>{
          this.router.navigate(['/admin','events','all'])
        },
        (err)=>{
        }
      )
  }

  denyEvent(){
    this.main.adminService.EventDeny(this.eventId)
      .subscribe(
        (res)=>{
          this.errCmp.OpenWindow(BaseMessages.Success);
          this.getThisEvent();
        },
        (err)=>{
        }
      )
  }

  approveEvent(){
    this.main.adminService.EventApprove(this.eventId)
      .subscribe(
        (res)=>{
          this.errCmp.OpenWindow(BaseMessages.Success);
          this.getThisEvent();
        },
        (err)=>{
        }
      )
  }

  getLink(link:string){

    let url = 'http://www.youtube.com/embed/';
        url+= link.split('/').pop();
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
    // return url;
  }

  openMap(){
    $('#modal-map-1').modal('show');
    this.isShowMap = true;
  }





}

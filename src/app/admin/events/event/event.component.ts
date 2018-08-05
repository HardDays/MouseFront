import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { Params } from '@angular/router';
import { EventGetModel } from '../../../core/models/eventGet.model';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { BaseImages } from '../../../core/base/base.enum';
import { Video } from '../../../core/models/accountCreate.model';

declare var $:any;

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent extends BaseComponent implements OnInit {

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
        // console.log('4')
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
        // console.log('3')
        // console.log(`Event`,this.Event);
      }
    )
  }

  getCreator(){
    if(this.Event.creator_id){
      this.main.accService.GetAccountById(this.Event.creator_id)
        .subscribe((acc)=>{
          this.Owner = acc;
          // console.log(this.Owner);
        })
    }
  }

  getArtists(){
    // console.log('0')
    if(this.Event.artist){
      this.Artists = [];
      this.Videos = [];
      for(let art of this.Event.artist){
        this.main.accService.GetAccountById(art.artist_id)
          .subscribe(
            (res)=>{
              this.Artists.push(res);
              // console.log(this.Artists);
              // console.log('1')
              if(res.videos.length>0){
                for(let v of res.videos){
                  this.Videos.push(this.getLink(v.link));
                   console.log(this.Videos)
                }
                // console.log('2')
              }
            }

          )
      }
    }
  }

  InitJs(){
    setTimeout(() => {

      // console.log('5')

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
    // console.log(`removeAcc`);
    this.main.adminService.EventDelete(this.eventId)
      .subscribe(
        (res)=>{
          // console.log(`res`,res);
          this.router.navigate(['/admin','events','all'])
        },
        (err)=>{
          // console.log(`err`,err)
        }
      )
  }

  denyEvent(){
    // console.log(`denyAcc`);
    this.main.adminService.EventDeny(this.eventId)
      .subscribe(
        (res)=>{
          // console.log(`res`,res);
          this.getThisEvent();
        },
        (err)=>{
          // console.log(`err`,err)
        }
      )
  }

  approveEvent(){
    // console.log(`approveAcc`);
    this.main.adminService.EventApprove(this.eventId)
      .subscribe(
        (res)=>{
          // console.log(`res`,res);
          this.getThisEvent();
        },
        (err)=>{
          // console.log(`err`,err)
        }
      )
  }

  getLink(link:string){

    console.log(`--------`);
    let url = 'http://www.youtube.com/embed/';
        url+= link.split('/').pop();
    return this._sanitizer.bypassSecurityTrustResourceUrl(url);
    // return url;
  }
    
  
  

}

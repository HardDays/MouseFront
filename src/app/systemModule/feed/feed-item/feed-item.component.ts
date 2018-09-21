import { MediaService } from './../../../core/services/media.service';
import { Component, OnInit, Input, NgZone, ChangeDetectorRef, OnChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { CommentModel } from '../../../core/models/comment.model';
import { BaseImages } from '../../../core/base/base.enum';
import { CurrencyIcons } from '../../../core/models/preferences.model';
import { TranslateService } from '../../../../../node_modules/@ngx-translate/core';
import { SettingsService } from '../../../core/services/settings.service';

declare var $:any;
declare var SC:any;

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.css']
})
export class FeedItemComponent extends BaseComponent implements OnInit, OnChanges {


  @Input() Feed:any;
  @Input() accId:number;

  myLogo:string = '';
  comment:CommentModel = new CommentModel();
  comments:CommentModel[] = [];
  isOpenComment:boolean = false;

  likes:any[] = [];

  videoUrl:any;
  Album:any;

  Audio:any;
  player:any;
  IsPlaying = false;
  audioDuration:number = 0;
  audioCurrentTime:number = 0;

  constructor(
    protected main           : MainService,
    protected _sanitizer     : DomSanitizer,
    protected router         : Router,
    protected mapsAPILoader  : MapsAPILoader,
    protected ngZone         : NgZone,
    protected activatedRoute : ActivatedRoute,
    protected cdRef          : ChangeDetectorRef,
    protected translate      :TranslateService,
    protected settings       :SettingsService
  ) {
    super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute,translate,settings);
  }

  ngOnInit(){
      // console.log(`in`,this.Feed);
    if(this.Feed&&this.Feed.account){

      if(this.Feed.account.image_id){
        this.Feed.account.img_base64 = this.main.imagesService.GetImagePreview(this.Feed.account.image_id,{width:200,height:200});
      }
      else{
        this.Feed.account.img_base64 = BaseImages.NoneFolowerImage;
      }
    }

    this.myLogo = this.main.MyLogo;
   // this.getLikes();
   // this.GetComments();
    $('.body-feed-item .photos-wrapp').css({
        'max-height': $('.for-min-height-photos').width()
    });
    $(window).resize(function(){
      $('.body-feed-item .photos-wrapp').css({
          'max-height': $('.for-min-height-photos').width()
      });
    });

    if(this.Feed&&this.Feed.action==='update_video'){
      this.getVideo();
    }
    else if(this.Feed&&this.Feed.action==='update_audio'){
      SC.initialize({
            client_id: "b8f06bbb8e4e9e201f9e6e46001c3acb",
        });
      this.getAudio();
    }
    else if(this.Feed&&this.Feed.action==='update_album'){
      this.getAlbum();
    }

  }

  ngOnChanges() {

  }

  calculateTime(value: Date){
        let result: string ='';
        // current time
        let now = new Date().getTime();
        let old = new Date(value).getTime();
        // time since message was sent in seconds
        let delta = (now - old) / 1000;
        // format string
        if (delta < 10) {
          result = this.GetTranslateString('just');
        } else if (delta < 60) { // sent in last minute
          result = Math.floor(delta) + this.GetTranslateString('Seconds');
        } else if (delta < 3600) { // sent in last hour
          result =Math.floor(delta / 60) + this.GetTranslateString('Minutes');
        } else if (delta < 86400) { // sent on last day
          result = Math.floor(delta / 3600) + this.GetTranslateString(' Hours');
        } else { // sent more than one day ago
          result = Math.floor(delta / 86400) + this.GetTranslateString('Dayd');
          if(Math.floor(delta / 86400)>1)
            result+=this.GetTranslateString('s');
        }
        return result;
  }

  postComment(){
    this.comment.account_id = this.accId;
    this.comment.event_id = this.Feed.event.id;
    this.main.commentService.PostComment(this.accId,this.Feed.id,this.comment.text)
      .subscribe((res)=>{
        // console.log(res);
        this.Feed.comments++;
        this.comment.text = '';
        this.GetComments();
      },(err)=>{
        // console.log(`err`,err);
      })
    // console.log(this.comment);
  }

  GetComments(){
    this.main.commentService.GetCommentByFeedId(this.accId,this.Feed.id)
      .subscribe((res:CommentModel[])=>{
        this.comments = res;
          for(let comm of this.comments){
            if(comm.account){
              if(comm.account.image_id)
                comm.account.image_base64 = this.main.imagesService.GetImagePreview(comm.account.image_id,{width:300,height:300});
              else{
                this.Feed.account.img_base64 = BaseImages.NoneFolowerImage;
              }
            }
          //   this.main.imagesService.GetImageById(comm.account.image_id)
          //   .subscribe((img)=>{
          //   comm.account.image_base64 = img.base64;
          // });
        }
        // console.log(this.comments);
      })
  }

  likePost(){
    //  console.log(this.Feed.event.id,this.accId);
    if(!this.Feed.is_liked){
      this.main.likesService.PostLike(this.accId,this.Feed.id)
        .subscribe((res)=>{
          this.Feed.is_liked = true;
          this.Feed.likes++;
          // console.log(res);
        },(err)=>{
          console.log(`err`,err)
        })
    } else {
      this.main.likesService.DeleteLike(this.accId,this.Feed.id)
      .subscribe((res)=>{
          this.Feed.is_liked = false;
          this.Feed.likes--;
      },(err)=>{
        console.log(`err`,err)
      })
    }
  }

  replaceAll(s:string){
    return s.replace(new RegExp('_', 'g'), ' ');
  }

  getValue(){
    // console.log(this.Feed);

    if(this.Feed.type === 'event_update'){
      switch(this.Feed.action){
        case 'update_updates_available':
          if(this.Feed.value === 'f')
            return 'No';
          else
            return 'Yes';

        case 'update_genres':{
          if(this.Feed.value&&this.Feed.value.length>0){
            let genresString:string = this.Feed.value.replace(new RegExp('_', 'g'), ' ');
            genresString = genresString.substring(1, genresString.length-1);
            genresString = genresString.replace(new RegExp('"', 'g'), '');

            return genresString;
          }
           return 'No Genres';
        }

        case 'update_updates_available':
          if(this.Feed.value === 'f')
            return 'No';
          else
            return 'Yes';

        case 'update_collaborators':
          if(this.Feed.value&&this.Feed.value.length>0&&this.Feed.value!='[]')
            return this.Feed.value;
          else
            return 'No Collaborators';

        case 'update_comments_available':
          if(this.Feed.value === 'f')
            return 'No';
          else
            return 'Yes';

        case 'launch_event':
          return '';


      }
      if(this.Feed.value)
        return this.Feed.value;
      else
        return 'No info';
    }


  }

  getImage(){
    if(this.Feed.value)
      return this.main.imagesService.GetImagePreview(this.Feed.value, {width:1000, height:1000});
    else
      return BaseImages.NoneFolowerImage;
  }

  getVideo(){
    if(this.Feed.value){
      this.main.MediaService.GeVideoById(this.Feed.account_id, +this.Feed.value)
        .subscribe(
          (res)=>{
            let id = '0';
            if(res.link.indexOf('youtube')>=0){
              id = res.link.split('watch?v=')[1];
            }
            else{
              id = res.link.split('youtu.be/')[1];
            }
            this.videoUrl = this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/'+id+'?rel=0');
          },
          (err)=>{
            this.videoUrl = null;
          }
        )
    }
  }

  getAudio(){
    if(this.Feed.value){
      this.main.MediaService.GeAudioById(this.Feed.account_id, +this.Feed.value)
        .subscribe(
          (res)=>{
            this.Audio = res;
          },
          (err)=>{
            this.Audio = null;
          }
        )
    }
  }
      playAudio(s:string){

      if(this.player&&  this.player.isPlaying()){
          this.player.pause();
           this.IsPlaying = false;
      }

        this.audioDuration = 0;
        this.audioCurrentTime = 0;
        SC.resolve(s).then((res)=>{
          SC.stream('/tracks/'+res.id).then((player)=>{
            this.player = player;
            this.player.play();
            this.IsPlaying = true;

            player.on('play-start',()=>{
              this.audioDuration = this.player.getDuration();
            })

            setInterval(()=>{
               this.audioCurrentTime = this.player.currentTime();
            },100)

            player.on('no_streams',()=>{
               this.IsPlaying = false;
                // this.errorCmp.OpenWindow(`<b>Warning:</b> uploaded song is not free! It will be impossible to play it!`);

            })

            // setTimeout(()=>{
            //   player.pause()
            //   player.seek(0)
            // },10000)

          });

        },(err)=>{
          this.IsPlaying = false;
            // this.errorCmp.OpenWindow(`<b>Warning:</b> uploaded song is not free! It will be impossible to play it!`);
        })
      }

      stopAudio(){
        if(this.player&&!this.player.isDead()){
            this.player.pause();
            this.IsPlaying = false;
          }
      }

  getAlbum(){
    if(this.Feed.value){
      this.main.MediaService.GeAlbumById(this.Feed.account_id, +this.Feed.value)
        .subscribe(
          (res)=>{
            this.Album = res;
            console.log(res);
          },
          (err)=>{
            this.Album = null;
          }
        )
    }
  }

  // getLikes(){
  //   this.main.likesService.GetLikesByEventId(this.Feed.event.id)
  //     .subscribe((res)=>{
  //       console.log(res);
  //       this.likes = res;
  //     },(err)=>{
  //       console.log(`err`,err)
  //     })
  // }
}


// update_tagline update_name

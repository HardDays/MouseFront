import { Component, OnInit, Input, NgZone, ChangeDetectorRef, OnChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { CommentModel } from '../../../core/models/comment.model';
import { BaseImages } from '../../../core/base/base.enum';
import { CurrencyIcons } from '../../../core/models/preferences.model';

declare var $:any;

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

  ngOnInit(){
      // console.log(`in`,this.Feed);
    if(this.Feed&&this.Feed.account)

      if(this.Feed.account.image_id){
        this.Feed.account.img_base64 = this.main.imagesService.GetImagePreview(this.Feed.account.image_id,{width:200,height:200});
      }
      else{
        this.Feed.account.img_base64 = BaseImages.NoneFolowerImage;
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


   
  }
  
  ngOnChanges() {
   
  }

  calculateTime(value: Date){
        let result: string;
        // current time
        let now = new Date().getTime();
        let old = new Date(value).getTime();
        // time since message was sent in seconds
        let delta = (now - old) / 1000;
        // format string
        if (delta < 10) {
          result = 'just';
        } else if (delta < 60) { // sent in last minute
          result = Math.floor(delta) + ' Seconds';
        } else if (delta < 3600) { // sent in last hour
          result =Math.floor(delta / 60) + ' Minutes';
        } else if (delta < 86400) { // sent on last day
          result = Math.floor(delta / 3600) + ' Hours';
        } else { // sent more than one day ago
          result = Math.floor(delta / 86400) + ' Day';
          if(Math.floor(delta / 86400)>1) 
            result+='s';
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
          if(this.Feed.value&&this.Feed.value.length>0)
            return this.Feed.value;
          else 
            return 'No Collaborators';
        
        case 'update_comments_available':
          if(this.Feed.value === 'f')
            return 'No';
          else 
            return 'Yes';
        
      }
      if(this.Feed.value)
        return this.Feed.value;
      else
        return 'No info';
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
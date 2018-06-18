import { Component, OnInit, Input, NgZone, ChangeDetectorRef, OnChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { CommentModel } from '../../../core/models/comment.model';

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
    this.main.imagesService.GetImageById(this.Feed.account.image_id)
      .subscribe((img)=>{
        this.Feed.account.img_base64 = img.base64;
      });
    this.myLogo = this.main.MyLogo;
   // this.getLikes();
   // this.GetComments();
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
          result = 'jetzt';
        } else if (delta < 60) { // sent in last minute
          result = Math.floor(delta) + ' Seconds';
        } else if (delta < 3600) { // sent in last hour
          result =Math.floor(delta / 60) + ' Minutes';
        } else if (delta < 86400) { // sent on last day
          result = Math.floor(delta / 3600) + ' Today';
        } else { // sent more than one day ago
          result = Math.floor(delta / 86400) + ' Days';
        }

        return result;
  }

  postComment(){
    this.comment.account_id = this.accId;
    this.comment.event_id = this.Feed.event.id;
    this.main.commentService.PostComment(this.comment)
      .subscribe((res)=>{
        console.log(res);
        this.GetComments();
      },(err)=>{
        console.log(`err`,err);
      })
    console.log(this.comment);
  }

  GetComments(){
    this.main.commentService.GetCommentByEventId(this.Feed.event.id)
      .subscribe((res:CommentModel[])=>{
        this.comments = res;
          for(let comm of this.comments){
            this.main.imagesService.GetImageById(comm.account.image_id)
            .subscribe((img)=>{
            comm.account.image_base64 = img.base64;
          });
        }
        console.log(this.comments);
      })
  }

  likePost(){
    console.log(this.Feed.event.id,this.accId);
    if(!this.Feed.is_liked){
      this.main.likesService.PostLike(this.Feed.event.id,this.accId)
        .subscribe((res)=>{
          this.Feed.is_liked = true;
          this.Feed.likes++;
          console.log(res);
        },(err)=>{
          console.log(`err`,err)
        })
    } else {
      this.main.likesService.DeleteLike(this.Feed.event.id,this.accId)
      .subscribe((res)=>{
          this.Feed.is_liked = false;
          this.Feed.likes--;
        console.log(res);
      },(err)=>{
        console.log(`err`,err)
      })
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



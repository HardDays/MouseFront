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
    console.log(`in`,this.Feed);
    if(this.Feed&&this.Feed.account)
    this.main.imagesService.GetImageById(this.Feed.account.image_id)
      .subscribe((img)=>{
        this.Feed.account.img_base64 = img.base64;
      });
    this.myLogo = this.main.MyLogo;
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

    console.log(this.comment);
  }
}



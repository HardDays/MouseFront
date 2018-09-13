import { Component, OnInit, Input, SimpleChanges, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommentEventModel } from '../../../core/models/commentEvent.model';
import { BaseImages } from '../../../core/base/base.enum';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../../../core/services/settings.service';
import { AccountGetModel } from '../../../core/models/accountGet.model';

@Component({
  selector: 'app-one-comment',
  templateUrl: './one-comment.component.html',
  styleUrls: ['./one-comment.component.css']
})
export class OneCommentComponent extends BaseComponent implements OnInit  {
  someComment:CommentEventModel = new CommentEventModel();
  Image: string = BaseImages.NoneFolowerImage;
  @Input() comment:CommentEventModel;
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

  ngOnInit() {
    this.initComment();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initComment();
   
  }

  initComment(){
    this.someComment = this.comment;
    this.GetImage();
  }
  GetImage(){
    if(this.someComment.account.image_id)
    {
        this.Image = this.main.imagesService.GetImagePreview(this.someComment.account.image_id, {width:120, height:120});
    }
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
}

import { Component, OnInit, NgZone, ChangeDetectorRef, Input, SimpleChanges, AfterViewChecked, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { CommentModel } from '../../../core/models/comment.model';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '../../../core/services/settings.service';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { BaseImages } from '../../../core/base/base.enum';
import { CommentEventModel } from '../../../core/models/commentEvent.model';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent extends BaseComponent implements OnInit,AfterViewInit  {
  comment:string = ""
  EventId:number;
  myAccount: AccountGetModel;
  AllCommentsEvent:CommentEventModel[] = [];
  Image: string = BaseImages.NoneFolowerImage;
  @Input() MyAcc: AccountGetModel;
  @Input() AllComments:any;
  @Output() onComment:EventEmitter<boolean> = new EventEmitter<boolean>();
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
    this.activatedRoute.params.forEach((params)=>{
      this.EventId = parseInt(params["id"]);
      
    });
    this.myAccount = this.MyAcc;
    this.AllCommentsEvent = this.AllComments;
    this.GetImage();
  }
  ngAfterViewInit(){
   
    document.getElementById("textareamsg").focus();
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.myAccount = this.MyAcc; 
    this.AllCommentsEvent = this.AllComments;
    this.GetImage();
  }
 
  GetImage(){
    if(this.myAccount.image_id)
    {
        this.Image = this.main.imagesService.GetImagePreview(this.myAccount.image_id, {width:120, height:120});
    }
  }

  postComment(){
    this.main.commentService.PostCommentsEvent(this.myAccount.id,this.EventId,this.comment)
      .subscribe((res)=>{
        this.onComment.emit();
        this.comment= "";
      },(err)=>{
      })
   
  }
}

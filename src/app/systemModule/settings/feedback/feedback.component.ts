import { Component, OnInit, NgZone, ChangeDetectorRef, ViewChild } from '@angular/core';
import { extend } from 'webdriver-js-extender';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { FeedbackModel } from '../../../core/models/feedback.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ErrorComponent } from '../../../shared/error/error.component';
import { BaseMessages } from '../../../core/base/base.enum';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent extends BaseComponent implements OnInit {

  @ViewChild('errorCmp') errorCmp: ErrorComponent;
  
  Feedback:FeedbackModel = new FeedbackModel();
  FormFeedback : FormGroup = new FormGroup({
    "feedback_topic":new FormControl("",[Validators.required]),
    "detail":new FormControl("",[Validators.required])
  });
  Rating:number = 3;

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
  }

  sendFeedback(){
    this.Feedback.rate_score = this.Rating+'';
    this.Feedback.account_id = this.main.CurrentAccount.id;
    if(!this.FormFeedback.invalid){
      // console.log(this.Feedback);
      this.main.feedbkService.PostFeedback(this.Feedback)
        .subscribe(
          (res)=>{
            this.errorCmp.OpenWindow(BaseMessages.Success);
          }
        );
    }
    else {
      this.errorCmp.OpenWindow(BaseMessages.Fail);
    }
   
    
  }

}

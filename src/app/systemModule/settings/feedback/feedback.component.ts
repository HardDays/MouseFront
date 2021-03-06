import { Component, OnInit, NgZone, ChangeDetectorRef, ViewChild } from '@angular/core';
// import { extend } from 'webdriver-js-extender';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { FeedbackModel } from '../../../core/models/feedback.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ErrorComponent } from '../../../shared/error/error.component';
import { BaseMessages } from '../../../core/base/base.enum';
import { TranslateService } from '../../../../../node_modules/@ngx-translate/core';
import { SettingsService } from '../../../core/services/settings.service';

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
    "message":new FormControl("",[Validators.required])
  });
  Rating:number = 0;
  showSuccess = false;

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
  }

  sendFeedback(){
    this.Feedback.rate_score = this.Rating+'';
    this.Feedback.account_id = this.main.CurrentAccount.id;
    if(!this.showSuccess){
      if(!this.FormFeedback.invalid){
        this.main.feedbkService.PostFeedback(this.Feedback)
          .subscribe(
            (res)=>{
              this.showSuccess = true;
              this.errorCmp.OpenWindow(BaseMessages.Success);
              setTimeout(() => {
                this.errorCmp.CloseWindow();
                this.showSuccess = false;
              }, 3000);
              this.Feedback.message = '';
              this.Feedback.feedback_type = '';
              this.Rating = 0;
            },
            (err)=>{
              if(err.json()['rate_score'][0] === "is not included in the list")
                this.errorCmp.OpenWindow('Please rate how we are doing first!');
              else
                this.errorCmp.OpenWindow(BaseMessages.Fail);
            }
          );
      }
      else {
          this.errorCmp.OpenWindow(BaseMessages.Fail);
      }
    }


  }

}

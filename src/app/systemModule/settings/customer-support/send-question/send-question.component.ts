import { Component, OnInit, NgZone, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../core/base/base.component';
import { MainService } from '../../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ErrorComponent } from '../../../../shared/error/error.component';
import { BaseErrors, BaseMessages } from '../../../../core/base/base.enum';
import { TranslateService } from '../../../../../../node_modules/@ngx-translate/core';
import { SettingsService } from '../../../../core/services/settings.service';

@Component({
  selector: 'app-send-question',
  templateUrl: './send-question.component.html',
  styleUrls: ['./send-question.component.css']
})
export class SendQuestionComponent extends BaseComponent implements OnInit {

  @ViewChild('errorCmp') errorCmp: ErrorComponent;
  
  FormMessage : FormGroup = new FormGroup({
    "subject":new FormControl("",[Validators.required]),
    "message":new FormControl("",[Validators.required]),
  });
  Message = {
    subject: '',
    message: '',
    account_id: 0
  }
  
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

  sendQuestions(){
    if(!this.FormMessage.invalid){
      this.Message.account_id = this.main.CurrentAccount.id;
      // console.log(this.FormMessage);
      this.main.questService.PostQuestions(this.Message.subject,this.Message.message, this.Message.account_id)
        .subscribe(
          (res)=>{
            this.Message.subject = '';
            this.Message.message = '';
            this.errorCmp.OpenWindow(BaseMessages.Success);
          }
        );
    }
    else {
      // console.log(`empty`);
    }
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { FeedbackAdminModel } from '../../core/models/feedback-admin.model';
import { BaseImages, BaseErrors, BaseMessages } from '../../core/base/base.enum';
import { ErrorComponent } from '../../shared/error/error.component';
declare var $:any;

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent extends BaseComponent implements OnInit {

  @ViewChild('errCmp') errCmp:ErrorComponent;
  
  Types = {
    enchancements: false,
    compliments: false,
    bugs: false,
    all: true
  }

  Feedbacks:FeedbackAdminModel[] = [];
  FeedbacksChecked:FeedbackAdminModel[] = [];
  openFeedback:FeedbackAdminModel = new FeedbackAdminModel();

  Message: string = '';
  nonImage = BaseImages.NoneFolowerImage;
  // Subject: string = '';

  Answer = {
    user_name:'',
    image:'',
    message:''
  }

  ngOnInit() {
    this.InitJs();
    this.getFeedbacks();
  }

  getFeedbacks(){
    this.main.adminService.GetFeedbacks()
      .subscribe(
        (res)=>{
          this.Feedbacks = res;
         

          if(this.Feedbacks)
            this.openNewFeedback(this.Feedbacks[0].id);
         

          for(let fb of this.Feedbacks){
            if(fb.account){
              if(fb.account.image_id)
                fb.account.image_base64_not_given = this.main.imagesService.GetImagePreview(fb.account.image_id,{width:100,height:100})
              else
                fb.account.image_base64_not_given = BaseImages.NoneFolowerImage;
            }
          }
          this.FeedbacksChecked = this.Feedbacks;

      
        }
      )

  }


  filterByType(){

      if(!this.Types.enchancements&&!this.Types.compliments&&!this.Types.bugs)
        this.Types.all = true;
  
      if(this.Types.all){
        this.FeedbacksChecked = this.Feedbacks;
      }
      else
      {
        this.Types.all = false;
        this.FeedbacksChecked = this.Feedbacks.filter(
            obj => obj.feedback_type && ( 
              this.Types.enchancements && obj.feedback_type === 'enchancement' ||
              this.Types.compliments && obj.feedback_type === 'compliment' ||
              this.Types.bugs && obj.feedback_type === 'bug'
            )
        );
      }
    
  }

  InitJs(){
    $('.support_answers .answer_head').click(function() {
      $(this).next().slideToggle();
      $(this).parent().toggleClass('opened');
    });

    $('.answer_file span').click(function() {
        $(this).parent().find('#answer_attach_file').click();
    });

    $('.mes_text_wrap span').click(function() {
        $(this).parent().find('#mes_attach_file').click();
    });
  }

  openNewFeedback(id:number){
    this.Message = '';
    this.main.adminService.GetFeedbackById(id)
    .subscribe(
      (fb)=>{
        this.openFeedback = fb;
        if(this.openFeedback.reply){
          this.Answer.message =  this.openFeedback.reply.simple_message;
          this.Answer.user_name =  this.openFeedback.reply.sender.user_name;
          if(this.openFeedback.reply.sender.image_id)
            this.Answer.image = this.main.imagesService.GetImagePreview(this.openFeedback.reply.sender.image_id,{width:100,height:100})
          else
            this.Answer.image = BaseImages.NoneFolowerImage;
        }
        else 
        this.Answer = { user_name:'', image:'', message:''}
      
      }              
    )
  }

  sendAnswer(){
    console.log(`Message`,this.openFeedback,this.Message);
    if(this.Message)
      this.main.adminService.FeedbackThankYou(this.openFeedback.id,this.Message)
        .subscribe(
          (res)=>{
            console.log(res);
            this.errCmp.OpenWindow(BaseMessages.Success);
            this.getFeedbacks();
          },
          (err)=>{
            console.log(`err`,err);
            this.errCmp.OpenWindow(BaseMessages.Fail);
          }
        )
    else
      this.errCmp.OpenWindow(BaseMessages.Fail);
  }

  DeleteItem(){
    this.main.adminService.FeedbackDelete(this.openFeedback.id)
      .subscribe(
        (res)=>{
          this.getFeedbacks();
        }
      )
  }


}

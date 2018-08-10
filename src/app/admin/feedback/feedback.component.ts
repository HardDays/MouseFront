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

  Type = 'all';

  Feedbacks:FeedbackAdminModel[] = [];
  FeedbacksChecked:FeedbackAdminModel[] = [];
  openFeedback:FeedbackAdminModel = new FeedbackAdminModel();
  transformedFb:any;
  Message: string = '';
  nonImage = BaseImages.NoneFolowerImage;
  fbTransformed:any;
  midScore:number;
  // Subject: string = '';

  Answer = {
    user_name:'',
    image:'',
    message:''
  }

  showSuccess = false;

  Rate = 0;

  ScrollDisabled = false;

  ngOnInit() {
    this.InitJs();
    this.getFeedbacks();

    this.main.adminService.GetFeedbacksOverall()
    .subscribe(
      (res)=>{
        this.Rate = res;
      }
    )
  }

  getFeedbacks(){
    this.main.adminService.GetFeedbacks({limit:8,offset:0})
      .subscribe(
        (res)=>{
          this.Feedbacks = res;
          
          // console.log(res);
          if(this.Feedbacks&&this.Feedbacks[0]&&this.Feedbacks[0].id)
            this.openNewFeedback(this.Feedbacks[0].id,this.Feedbacks[0]);
         

          for(let fb of this.Feedbacks){
            //вот блядь не могу взять от сюда fb.rate_score поэтому буду прогонять другим циклом
            if(fb.sender){
              if(fb.sender.image_id)
                fb.sender.image_base64 = this.main.imagesService.GetImagePreview(fb.sender.image_id,{width:100,height:100})
              else
                fb.sender.image_base64 = BaseImages.NoneFolowerImage;
            }
          }
         
          
          
          
          this.FeedbacksChecked = this.Feedbacks;
        
      
        }
      )

  }


  // filterByType(){

  //     if(!this.Types.enchancements&&!this.Types.compliments&&!this.Types.bugs)
  //       this.Types.all = true;
  
  //     if(this.Types.all){
  //       this.FeedbacksChecked = this.Feedbacks;
  //     }
  //     else
  //     {
  //       this.Types.all = false;
  //       this.FeedbacksChecked = this.Feedbacks.filter(
  //           obj => obj.feedback_type && ( 
  //             this.Types.enchancements && obj.feedback_type === 'enchancement' ||
  //             this.Types.compliments && obj.feedback_type === 'compliment' ||
  //             this.Types.bugs && obj.feedback_type === 'bug'
  //           )
  //       );
  //     }
    
  // }

  filterByType(){

    if(this.Type === 'all')
      this.FeedbacksChecked = this.Feedbacks;
    else 
      this.FeedbacksChecked = this.Feedbacks.filter(obj => obj.message_info.feedback_type && (this.Type === obj.message_info.feedback_type));
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

  openNewFeedback(id:number,fb:any){
    this.Message = '';
    this.fbTransformed = fb;
    this.main.adminService.GetFeedbackById(id)
    .subscribe(
      (fb)=>{
        this.openFeedback = fb;
        if(this.openFeedback.reply.length>0){
          this.Answer.message =  this.openFeedback.reply[0].message;
          if(this.openFeedback.reply[0]&&this.openFeedback.reply[0].sender&&this.openFeedback.reply[0].sender.user_name)
            this.Answer.user_name =  this.openFeedback.reply[0].sender.user_name;
          else
            this.Answer.user_name = 'Admin';
          if(this.openFeedback.reply[0]&&this.openFeedback.reply[0].sender&&this.openFeedback.reply[0].sender.image_id)
            this.Answer.image = this.main.imagesService.GetImagePreview(this.openFeedback.reply[0].sender.image_id,{width:100,height:100})
          else
            this.Answer.image = BaseImages.NoneFolowerImage;
        }
        else 
        this.Answer = { user_name:'', image:'', message:''}
      
      }              
    )
  }

  sendAnswer(){
    if(!this.showSuccess){
      if(this.Message)
        this.main.adminService.FeedbackThankYou(this.openFeedback.id,this.Message)
          .subscribe(
            (res)=>{
              this.showSuccess = true;
              this.errCmp.OpenWindow(BaseMessages.Success);
              setTimeout(() => {
                if(this.errCmp.isShown)
                  this.errCmp.CloseWindow();
                  this.showSuccess = false; 
              }, 2500);
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
  }

  DeleteItem(){
    this.main.adminService.FeedbackDelete(this.openFeedback.id)
      .subscribe(
        (res)=>{
          this.getFeedbacks();
        }
      )
  }

  onScroll(){
    this.ScrollDisabled = true;
    this.main.adminService.GetFeedbacks({limit:8,offset:this.Feedbacks.length})
      .subscribe(
        (res)=>{
          for(let fb of res){
            //вот блядь не могу взять от сюда fb.rate_score поэтому буду прогонять другим циклом
            if(fb.sender){
              if(fb.sender.image_id)
                fb.sender.image_base64 = this.main.imagesService.GetImagePreview(fb.sender.image_id,{width:100,height:100})
              else
                fb.sender.image_base64 = BaseImages.NoneFolowerImage;
            }
          }
          
          this.Feedbacks.push(...res);

          setTimeout(() => {
            this.ScrollDisabled = false;
          }, 200);
        }
      )
  }


}

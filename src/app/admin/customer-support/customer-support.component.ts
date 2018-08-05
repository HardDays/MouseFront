import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { BaseImages } from '../../core/base/base.enum';
import { Subject } from 'rxjs';


interface Question {
  id:number,
  subject: string,
  account: AccountGetModel,
  date:string,
  message:string,
  question_reply:any
}

@Component({
  selector: 'app-customer-support',
  templateUrl: './customer-support.component.html',
  styleUrls: ['./customer-support.component.css']
})
export class CustomerSupportComponent extends BaseComponent implements OnInit {

  Questions:Question[] = [];
  openQuestion:Question;
  nonImage = BaseImages.NoneFolowerImage;

  // Subject:string = '';
  // Message:string = '';

  AnswerOptions: {subject:'', message:''}[] = [];

  DefaultAnswer = {
    subject:'',
    message: ''
  };

  Answer = {
    subject:'',
    message: ''
  };

  ngOnInit() {
    this.GetQuestions();
    this.UpdateAnwerOptions();
  }


  GetQuestions(){
    this.main.adminService.GetQuestions()
    .subscribe(
      (res)=>{
        // console.log(res);
        this.Questions = res;
        if(this.Questions&&this.Questions[0]&&this.Questions[0].id)
          this.openNewQuestion(this.Questions[0].id)

        for(let q of this.Questions){
          if(q.account)
          {
            if(q.account.image_id){
              q.account.image_base64_not_given = this.main.imagesService.GetImagePreview(q.account.image_id,{width:100,height:100})
            }
            else
              q.account.image_base64_not_given = BaseImages.NoneFolowerImage;
          }
        }

      }
    )
  }


  openNewQuestion(id:number){

    this.Answer = this.DefaultAnswer;

    this.main.adminService.GetQuestionById(id)
      .subscribe((res)=>{
        // console.log(res);
        this.openQuestion = res;

        if(this.openQuestion.account&&this.openQuestion.account.image_id){
          this.openQuestion.account.image_base64_not_given = this.main.imagesService.GetImagePreview(this.openQuestion.account.image_id,{width:100,height:100})
        }
        else
        this.openQuestion.account.image_base64_not_given = BaseImages.NoneFolowerImage;

        if(this.openQuestion.question_reply){
          if(this.openQuestion.question_reply.sender&&this.openQuestion.question_reply.sender.image_id){
            this.openQuestion.question_reply.sender.image_base64_not_given = this.main.imagesService.GetImagePreview(this.openQuestion.question_reply.sender.image_id,{width:100,height:100})
          }
          
        }

      }
    )
  }

  UpdateAnwerOptions()
  {
    this.main.adminService.GetAnswerReplyTemplates()
      .subscribe(
        (res:any[]) =>
        {
          this.AnswerOptions = res;
          // console.log("answer", this.AnswerOptions);
          
        }
      )
  }

  SendAnswer(){
    this.main.adminService.QuestionReplyById(this.openQuestion.id,this.Answer.subject,this.Answer.message)
      .subscribe(
        (res)=>{
          console.log(res);
          this.GetQuestions();
        }
      )
  }

  DeleteItem(){
    this.main.adminService.QuestionDelete(this.openQuestion.id)
      .subscribe(
        (res)=>{
          this.GetQuestions();
        }
      )
  }
  
}

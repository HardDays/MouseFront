import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { BaseImages } from '../../core/base/base.enum';
import { Subject, ReplaySubject } from 'rxjs';


interface Question {
  id:number,
  subject: string,
  // account: AccountGetModel,
  date:string,
  message:string,
  sender_id:number,
  created_at:string,
  sender: {
    full_name:string,
    user_name:string,
    image_id:number,
    image_base64:string,
    account_type:string
  },
  reply:{
    created_at:string,
    id:number,
    message:string,
    message_type:string,
    sender: {
      full_name:string,
      user_name:string,
      image_id:number,
      image_base64:string,
      account_type:string
    },
    sender_id:number,
    subject:string
  }[]
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
          if(q.sender)
          {
            if(q.sender.image_id){
              q.sender.image_base64 = this.main.imagesService.GetImagePreview(q.sender.image_id,{width:100,height:100})
            }
            else
              q.sender.image_base64 = BaseImages.NoneFolowerImage;
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
        
        // if(this.openQuestion.reply.length === 0){
          this.openQuestion.reply.unshift({
            created_at: this.openQuestion.created_at,
            id:this.openQuestion.id,
            message:this.openQuestion.message,
            message_type:'Support',
            sender: this.openQuestion.sender,
            sender_id:this.openQuestion.sender_id,
            subject:this.openQuestion.subject
            }
          )
        // }

        

        for(let reply of this.openQuestion.reply){
          if(reply.sender){
            if(reply.sender.image_id)
              reply.sender.image_base64 = this.main.imagesService.GetImagePreview(reply.sender.image_id,{width:100,height:100})
            else
              reply.sender.image_base64 = BaseImages.NoneFolowerImage;
          }
        }
        
        // console.log(`open message`,this.openQuestion)
        

        // if(this.openQuestion.reply){
        //   if(this.openQuestion.reply[0].sender){
        //     if(this.openQuestion.reply[0].sender.image_id)
        //       this.openQuestion.reply[0].sender.image_base64 = this.main.imagesService.GetImagePreview(this.openQuestion.reply[0].sender.image_id,{width:100,height:100});
        //     else
        //       this.openQuestion.reply[0].sender.image_base64 = BaseImages.NoneFolowerImage;
        //   }
          
        // }

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
    this.main.adminService.QuestionReplyById(this.openQuestion.reply[this.openQuestion.reply.length-1].id,this.Answer.subject,this.Answer.message)
      .subscribe(
        (res)=>{
          this.Answer.message = '';
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

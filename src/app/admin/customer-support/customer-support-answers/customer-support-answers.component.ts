import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';

declare var $:any;

export interface AnswerTemplateInterface{
  id: number;
  subject: string;
  message: string;
  status: string;
}

@Component({
  selector: 'app-customer-support-answers',
  templateUrl: './customer-support-answers.component.html',
  styleUrls: ['./customer-support-answers.component.css']
})
export class CustomerSupportAnswersComponent extends BaseComponent implements OnInit {

  Templates: {id:number,subject:string,message:string,status:string}[] = [];
  checkedTemplates: {id:number,subject:string,message:string,status:string}[] = [];
  openTemplate = {id:0,subject:'',message:'',status:''};
  isSuperUser:boolean = false;
  isEdit = false;

  ngOnInit() {
    this.isSuperUser = this.MyUser.is_superuser?true:false;



    this.GetTemplates();
  }

  initJs(){
    $('.support_answers .answer_head').click(function() {
      
      if($(this).parent().hasClass('opened')){
        $(this).parent().removeClass('opened');
      }
      else{
        $(this).parent().addClass('opened')
      }
      $(this).next().slideToggle();
     // $(this).parent().toggleClass('opened');
    });

    $('.answer_file span').click(function() {
        $(this).parent().find('#answer_attach_file').click();
    });

    $('.mes_text_wrap span').click(function() {
        $(this).parent().find('#mes_attach_file').click();
    });
  }

  GetTemplates(){
    
    this.main.adminService.GetReplyTemplates()
    .subscribe(
      (res)=>{
        this.Templates = res;
        this.checkedTemplates = this.Templates;
        setTimeout(() => {
          this.initJs();
        }, 200);
      }
    )
  }

  searchTemplate(event){
    let searchParam:string = event.target.value;
    if(searchParam){
      this.checkedTemplates = this.Templates.filter(obj => obj.subject.toUpperCase().indexOf(searchParam.toUpperCase())>=0||obj.message.toUpperCase().indexOf(searchParam.toUpperCase())>=0);
    }
    else
    {
      this.checkedTemplates = this.Templates;
    }
    setTimeout(() => {
      this.initJs();
    }, 500);


  }

  OpenTemplate(temp){
    this.openTemplate = temp;
    this.isEdit = true;
  }

  AddTemplate(){

    this.main.adminService.AddReplyTemplate(this.openTemplate.subject,this.openTemplate.message)
    .subscribe(
      (res)=>{
        this.GetTemplates();
        this.clearTemplate();
        this.openTemplate.id = res['id'];
        this.approveTemplate();
        // this.Templates.push(this.openTemplate);111


      },
      (err)=>{
      }
    )
  }

  PatchTemplate(){
    this.main.adminService.PatchReplyTemplate(this.openTemplate.id,this.openTemplate.subject,this.openTemplate.message)
      .subscribe(
        (res)=>{
         this.clearTemplate();
          this.GetTemplates();

        }
      )
  }

  DeleteTemplate(id:number){
    this.main.adminService.DeleteReplyTemplate(id)
      .subscribe(
        (res)=>{
          this.GetTemplates();
        }
      )
  }

  updateTemplate(){
    if(this.isEdit)
      this.PatchTemplate();
    else
      this.AddTemplate();
  }

  clearTemplate()
  {
    this.openTemplate = {id:0,subject:'',message:'',status:''};
    this.isEdit = false;
  }

  approveTemplate(){
    this.main.adminService.ApproveTemplatyById(this.openTemplate.id)
      .subscribe(
        (res)=>{
          this.GetTemplates();
          this.openTemplate = {id:0,subject:'',message:'',status:''};
        }
      )
  }

}

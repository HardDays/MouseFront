import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';

declare var $:any;

@Component({
  selector: 'app-customer-support-answers',
  templateUrl: './customer-support-answers.component.html',
  styleUrls: ['./customer-support-answers.component.css']
})
export class CustomerSupportAnswersComponent extends BaseComponent implements OnInit {

  Templates: {id:number,subject:string,message:string,status:string}[] = [];
  openTemplate = {id:0,subject:'',message:'',status:''};
  isSuperUser:boolean = false;
  isEdit = false;

  ngOnInit() {
    this.isSuperUser = this.MyUser.is_superuser?true:false;
    console.log(this.isSuperUser);
    
    
    this.GetTemplates();
  }

  initJs(){
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

  GetTemplates(){
    setTimeout(() => {
      this.initJs();
    }, 1500);
    this.main.adminService.GetReplyTemplates()
    .subscribe(
      (res)=>{
        this.Templates = res;
      }
    )
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
        // console.log(`ok`)
        // this.Templates.push(this.openTemplate);111


      },
      (err)=>{
        console.log(`err`,err)
      }
    )
  }

  PatchTemplate(){
    console.log(this.openTemplate.id,this.openTemplate.subject,this.openTemplate.message)
    this.main.adminService.PatchReplyTemplate(this.openTemplate.id,this.openTemplate.subject,this.openTemplate.message)
      .subscribe(
        (res)=>{
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
    console.log(`111`)
    if(this.isEdit)
      this.PatchTemplate();
    else
      this.AddTemplate();
  }

}

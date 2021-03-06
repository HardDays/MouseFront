import { Component, OnInit, NgZone, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AuthMainService } from '../../../core/services/auth.service';
import { AccountService } from '../../../core/services/account.service';
import { ImagesService } from '../../../core/services/images.service';
import { TypeService } from '../../../core/services/type.service';
import { GenresService } from '../../../core/services/genres.service';
import { EventService } from '../../../core/services/event.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'angular2-social-login';
import { MapsAPILoader } from '@agm/core';
import { Http } from '@angular/http';
import { PhoneService } from '../../../core/services/phone.service';
import { MainService } from '../../../core/services/main.service';
import { ErrorComponent } from '../../../shared/error/error.component';
import { BaseMessages } from '../../../core/base/base.enum';

declare var $: any;

@Component({
  selector: 'app-register-phone',
  templateUrl: './register-phone.component.html',
  styleUrls: ['./register-phone.component.css']
})
export class RegisterPhoneComponent extends BaseComponent implements OnInit {

  @Output() phoneStatus = new EventEmitter<{status:boolean,phone:string}>()
  @Output('showPhone') isShowPhone = new EventEmitter<boolean>();
  @ViewChild('errorCmp') errorCmp: ErrorComponent;

  isRequestCodeSend:boolean = false;
  inputCodeStatus:number = 1;
  codes:any[]=[];
  selectCode:any;

  phone:string = '';
  phoneCode:string = '';
  phoneArr:boolean = false;
  codeRequest:string[]=[];

  curPos = '+1';

  ngOnInit() {
  // this.main.phoneService.GetAllPhoneCodes().
  //   subscribe((res)=>{
  //     this.codes = res;
  //     this.phoneCode = '+1';
  //   });
    this.codes = this.main.phoneService.GetAllPhoneCodesWithFormat();
    this.selectCode = this.codes.find((s)=>s.iso2==='us');
  }

  changeCode(s){
    this.phoneCode = s;
  }

  inputPhone($event){
  }

  sendCode(){
    if(this.phone&&this.phone.search('_')<0){
        this.phoneArr = false;

      let phoneToSend = this.phone.replace(/ /g,'');
          phoneToSend = phoneToSend.replace(/\(/g,'');
          phoneToSend = phoneToSend.replace(/\)/g,'');
          phoneToSend = phoneToSend.replace(/-/g,'');

        this.WaitBeforeLoading(
        ()=>this.main.phoneService.SendCodeToPhone(phoneToSend),
          (res)=>{
          this.isRequestCodeSend = true;
          },
          (err)=>{
            if(err.json()['phone']){
              let error = err.json()['phone'].replace('_', ' ').toLowerCase();
              this.errorCmp.OpenWindow(`Phone is `+error);

              if(err.json()['phone']==='ALREADY_VALIDATED'){
                setTimeout(()=>{
                  if(this.errorCmp.isShown)
                    this.errorCmp.CloseWindow();
                  this.isShowPhone.emit(true);
                  this.phoneStatus.emit({status:true,phone:this.phone});
                },1800)
              }
              
            }
            else{
              this.errorCmp.OpenWindow(this.getResponseErrorMessage(err));
            }
           
            // .replace('_', ' '):'').toLowerCase()
            // if(err=="'phone': 'ALREADY_VALIDATED'"){
            //   this.isShowPhone.emit(true);
            //   this.phoneStatus.emit({status:true,phone:this.phone});
            // }
            // this.errorCmp.OpenWindow(this.getResponseErrorMessage(err));
            
          }
      );
    }

    else {
      this.phoneArr = true;
    }

  }
  
  resendCode(){
    if(this.phone.length>0){
      this.phoneArr = false;

      let phoneToSend = this.phone.replace(/ /g,'');
      phoneToSend = phoneToSend.replace(/\(/g,'');
      phoneToSend = phoneToSend.replace(/\)/g,'');
      phoneToSend = phoneToSend.replace(/-/g,'');

      this.WaitBeforeLoading(
        ()=>this.main.phoneService.ReSendCodeToPhone(phoneToSend),
          (res)=>{
          this.isRequestCodeSend = true;
          this.codeRequest=[];
          this.errorCmp.OpenWindow(BaseMessages.Success);
          },
          (err)=>{

            this.errorCmp.OpenWindow(this.getResponseErrorMessage(err));
            
          }
      );
    }
    else{
      this.phoneArr = true;
    }
  }

  inputCode($event,num:number){
    if($event.target.value&&$event.target.value.length==1){
      if(num==1){
        this.inputCodeStatus = 2;
        document.getElementById("code2").focus();
      }
      if(num==2){
        this.inputCodeStatus = 3;
        document.getElementById("code3").focus();
      }
      if(num==3){
        this.inputCodeStatus = 4;
        document.getElementById("code4").focus();
      }
      if(num==4){
        this.inputCodeStatus = 1;
        document.getElementById("code1").focus();
      }
    }

  }

  sendRequest(){
    if(this.codeRequest.length==4){

      let code = this.codeRequest[0]+this.codeRequest[1]+this.codeRequest[2]+this.codeRequest[3];

      let phoneToSend = this.phone.replace(/ /g,'');
          phoneToSend = phoneToSend.replace(/\(/g,'');
          phoneToSend = phoneToSend.replace(/\)/g,'');
          phoneToSend = phoneToSend.replace(/-/g,'');

      this.WaitBeforeLoading(
        ()=> this.main.phoneService.SendRequestCode(phoneToSend,code),
          (res)=>{
            this.isShowPhone.emit(true);
            this.phoneStatus.emit({status:true,phone:this.phone});
          },
          (err)=>{
            this.errorCmp.OpenWindow('Code is invalid');
            
          }
      );
    }

  }

  skipPhone(){
    this.isShowPhone.emit(false);
  }

}

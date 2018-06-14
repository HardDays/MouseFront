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
  codes:[{name:string,dial_code:string}];

  phone:string = '';
  phoneCode:string = '';
  phoneArr:boolean = false;
  codeRequest:string[]=[];

  curPos = '+1';

  ngOnInit() {
  this.main.phoneService.GetAllPhoneCodes().
    subscribe((res)=>{
      this.codes = res;
      this.phoneCode = this.codes[0].dial_code;
    });
  }

  inputPhone($event){
    this.phone = $event.target.value;
  }

  sendCode(){
    if(this.phone.length>0){
      this.phoneArr = false;
      let phone = this.phoneCode + this.phone;
      this.WaitBeforeLoading(
        ()=>this.main.phoneService.SendCodeToPhone(phone),
          (res)=>{
          this.isRequestCodeSend = true;
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
      let phone = this.phoneCode+this.phone;
      let code = this.codeRequest[0]+this.codeRequest[1]+this.codeRequest[2]+this.codeRequest[3];

      this.WaitBeforeLoading(
        ()=> this.main.phoneService.SendRequestCode(phone,code),
          (res)=>{
            this.isShowPhone.emit(true);
            this.phoneStatus.emit({status:true,phone:phone});
          },
          (err)=>{
            this.errorCmp.OpenWindow(this.getResponseErrorMessage(err));
            
          }
      );
    }

  }

  skipPhone(){
    this.isShowPhone.emit(false);
  }

}

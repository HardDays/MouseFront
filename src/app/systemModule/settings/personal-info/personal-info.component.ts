import { Component, OnInit, Input, OnChanges, Output, EventEmitter, NgZone, ChangeDetectorRef, ViewChild } from '@angular/core';
import { UserGetModel } from '../../../core/models/userGet.model';
import { UserCreateModel } from '../../../core/models/userCreate.model';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { ErrorComponent } from '../../../shared/error/error.component';
import { BaseMessages } from '../../../core/base/base.enum';
import { TranslateService } from '../../../../../node_modules/@ngx-translate/core';
import { SettingsService } from '../../../core/services/settings.service';

declare var $:any;

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent extends BaseComponent implements OnInit, OnChanges {

  inputCodeStatus:number = 1;
  isRequestCodeSend:boolean = false;
  phone:string = '';
  phoneCode:string = '';
  phoneArr:boolean = false;
  codeRequest:string[]=[];

  phoneMask:string='';
  isSendRequest = false;

  @Input() User: UserCreateModel;
  @Output() OnSave = new EventEmitter<UserCreateModel>();

  @ViewChild('errorCmp') errorCmp: ErrorComponent;

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

    this.InitModals();


  }
  ngOnChanges(){
    this.phone = this.User.register_phone;
    this.phoneMask = this.phone;
    if(this.User.image_id){
      this.main.imagesService.GetImageById(this.User.image_id)
        .subscribe((res)=>{
          this.User.image_base64 = res.base64;
        })
    }
  }


  InitModals(){
    $('#change_personal_phone_number').click(function() {
      $('#modal_change_phone').modal('show');
    });

    $('#wrong_number').click(function(e) {
      e.preventDefault();
      $('#modal_change_phone_ver').modal('hide');
      $('#modal_change_phone').modal('show');
    });

    // $('#validate_personal_phone_code').click(function(e) {
    //     e.preventDefault();
    //     $('#modal_change_phone_ver').modal('hide');
    //     $('#success_change_phone').modal('show');
    // });
  }

  SaveUser(){
    // this.User.register_phone = this.convertPhoneToSend(this.phone);

    if(this.User.password&&this.User.password.length<6){
      this.errorCmp.OpenWindow(`This password is too short!`);
      return;
    }
    if(this.User.password&&this.User.password.length>=100){
      this.errorCmp.OpenWindow(`This password is too long!`);
      return;
    }

    delete this.User['register_phone'];

    if(!this.User.password||(this.User&&this.User.password.length>=6)){
      this.main.authService.UpdateUser(this.User)
        .subscribe(
            (res)=>{
                this.User = res;
                // if(this.User.image_id){
                //   this.main.imagesService.GetImageById(this.User.image_id)
                //     .subscribe((res)=>{
                //       this.User.image_base64 = res.base64;
                //     })
                // }
                this.errorCmp.OpenWindow(BaseMessages.Success);
                this.main.GetMyUser();

            },
            (err)=>{
                this.errorCmp.OpenWindow(this.getResponseErrorMessage(err));
            }
        );
    }
    else {
      this.errorCmp.OpenWindow(`This password is too short!`);
    }
  }

  inputPhone($event){
    this.phone = $event.target.value;
  }

  sendCode(){
    if(this.phone.length>0){
      this.codeRequest = [];
      // this.phone = this.getCurrentNumber(this.phone);
      //this.phoneArr = false;
     // let phone:string = this.phoneCode + this.phone;
      this.WaitBeforeLoading(
        ()=>this.main.phoneService.SendCodeToPhone(this.phone),
          (res)=>{

            //this.isRequestCodeSend = true;
            $('#modal_change_phone').modal('hide');
            $('#modal_change_phone_ver').modal('show');
          },
          (err)=>{
            if(err.json()&&err.json()['phone']&&err.json()['phone']==='ALREADY_USED')
              this.errorCmp.OpenWindow('Phone is already used!');
            if(err.json()&&err.json()['phone']&&err.json()['phone']==='ALREADY_VALIDATED'){
               $('#modal_change_phone').modal('hide');
               $('#modal_change_phone_ver').modal('show');
            }

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
    if(!this.isSendRequest){
      if(this.codeRequest.length==4){
        let code = this.codeRequest[0]+this.codeRequest[1]+this.codeRequest[2]+this.codeRequest[3];
        this.WaitBeforeLoading(
          ()=> this.main.phoneService.SendRequestCode(this.convertPhoneToSend(this.phone),code),
            (res)=>{
              this.isSendRequest = true;
              // this.User.register_phone = this.convertPhoneToSend(this.phone);
              this.codeRequest = [];
              $('#modal_change_phone_ver').modal('hide');
              this.main.authService.UpdateUserPhone(this.phone)
                .subscribe(
                  (res)=>{
                    this.User.register_phone = this.phone;
                    this.isSendRequest = false;
                    $('#success_change_phone').modal('show');
                  },
                  (err)=>{
                    this.errorCmp.OpenWindow(BaseMessages.Fail);
                    this.isSendRequest = false;
                  }
                )

              //this.isShowPhone.emit(true);
            // this.phoneStatus.emit({status:true,phone:phone});
            },
            (err)=>{
              this.isSendRequest = true;
              if(err.json()['code']&&err.json()['code'][0]==='INVALID'){
                  this.errorCmp.OpenWindow('Sorry, this code is invalid!');
                }
              else{
                this.errorCmp.OpenWindow(this.getResponseErrorMessage(err));
                }
                setTimeout(() => {
                    if(this.errorCmp.isShown)
                      this.errorCmp.CloseWindow();
                      this.isSendRequest = false;
                  }, 3000);
            }
        );
      }
    }
  }

  uploadImage($event){
    this.ReadImages(
        $event.target.files,
        (res:string)=>{
            this.User.image_base64 = res;
            // this.isNewImage = true;
        }
    );
  }

  getCurrentNumber(val){
    if(!val)
        return '';

        let phone = '';

        let codes = this.main.phoneService.GetAllPhoneCodesWithFormat();

        let code_arr = codes.filter((c)=>val.indexOf(c.dial_code)>0&&val.indexOf(c.dial_code)<4);
        let code = code_arr.find((c)=>val[1]===c.dial_code);
        if(!code)code = code_arr[0];
        let dial_code = code.dial_code;
        if(code['format']){
            let index = 0;
            if(val[index]==='+')index++;

            for(let c of code['format']){
                if(c==='.')
                {
                    phone+=val[index]?val[index]:'';
                    index++;
                }
                else{
                    phone+=c;
                }
            }
        }

        phone = phone.replace('_','');

        return phone.length?phone:val;
  }

  convertPhoneToSend(phone:string){
    return phone.replace(new RegExp('-', 'g'),'').replace(new RegExp(' ', 'g'),'').replace('(','').replace(')','');
  }


}

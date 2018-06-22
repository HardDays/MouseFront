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
    protected cdRef          : ChangeDetectorRef
  ) {
    super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute);
  }
  
  
  ngOnInit() {
    console.log(`init!`);

    this.InitModals();
   

  }
  ngOnChanges(){
    // console.log(`infooo`);
    this.phone = this.User.register_phone;
    if(this.User.image_id){
      this.main.imagesService.GetImageById(this.User.image_id)
        .subscribe((res)=>{
          console.log(`res img`, res);
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
    console.log(`save user`,this.User);
    this.main.authService.UpdateUser(this.User)
      .subscribe(
          (res)=>{
              this.User = res;
              if(this.User.image_id){
                this.main.imagesService.GetImageById(this.User.image_id)
                  .subscribe((res)=>{
                    console.log(`res img`, res);
                    this.User.image_base64 = res.base64;
                  })
              }
              this.errorCmp.OpenWindow(BaseMessages.Success);
              console.log(`res`,this.User);
              
          },
          (err)=>{
              console.log(`err`,err);
              this.errorCmp.OpenWindow(this.getResponseErrorMessage(err));
          }
      );
  }

  inputPhone($event){
    this.phone = $event.target.value;
  }
  sendCode(){
    if(this.phone.length>0){
      //this.phoneArr = false;
     // let phone:string = this.phoneCode + this.phone;
      this.WaitBeforeLoading(
        ()=>this.main.phoneService.SendCodeToPhone(this.phone),
          (res)=>{
            //this.isRequestCodeSend = true;
            $('#modal_change_phone').modal('hide');
            $('#modal_change_phone_ver').modal('show');
            console.log(`sendCode`);
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
      this.WaitBeforeLoading(
        ()=> this.main.phoneService.SendRequestCode(this.phone,code),
          (res)=>{
            console.log(`sendRequest`);
            this.User.register_phone = this.phone;
            this.codeRequest = [];
            $('#modal_change_phone_ver').modal('hide');
            $('#success_change_phone').modal('show');
            //this.isShowPhone.emit(true);
           // this.phoneStatus.emit({status:true,phone:phone});
          },
          (err)=>{
            this.errorCmp.OpenWindow(this.getResponseErrorMessage(err));
            
          }
      );
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
  

}

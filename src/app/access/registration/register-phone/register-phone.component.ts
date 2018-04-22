import { Component, OnInit, NgZone, Output, EventEmitter } from '@angular/core';
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

declare var $: any;

@Component({
  selector: 'app-register-phone',
  templateUrl: './register-phone.component.html',
  styleUrls: ['./register-phone.component.css']
})
export class RegisterPhoneComponent extends BaseComponent implements OnInit {

  @Output() phoneStatus = new EventEmitter<{status:boolean,phone:string}>()

  isRequestCodeSend:boolean = false;
  inputCodeStatus:number = 1;
  codes:[{name:string,dial_code:string}];
  
  phone:string = '';
  phoneCode:string = '';

  codeRequest:string[]=[];

  constructor(protected authService: AuthMainService,
    protected accService:AccountService,
    protected imgService:ImagesService,
    protected typeService:TypeService,
    protected genreService:GenresService,
    protected eventService:EventService,
    protected _sanitizer: DomSanitizer,
    protected router: Router,public _auth: AuthService,
    private mapsAPILoader: MapsAPILoader, 
    private ngZone: NgZone, protected h:Http,
    private activatedRoute: ActivatedRoute,
    private phoneService: PhoneService
  ){
    super(authService,accService,imgService,typeService,genreService,eventService,_sanitizer,router,h,_auth);
    }
    
  

  ngOnInit() {
  this.phoneService.GetAllPhoneCodes().
    subscribe((res)=>{
      this.codes = res;
      this.phoneCode = this.codes[0].dial_code;
    });
  }
  
  inputPhone($event){
    this.phone = (+$event.target.value)+'';
  }

  sendCode(){
    let phone = this.phoneCode + this.phone;
    this.phoneService.SendCodeToPhone(phone).
      subscribe((res)=>{
        this.isRequestCodeSend = true;
      }, (err)=>{
        console.log(err);
      });
  }

  inputCode($event,num:number){
    // console.log($event,num);
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
      this.phoneService.SendRequestCode(phone,code).
        subscribe((res)=>{
          console.log(`success`);
          this.phoneStatus.emit({status:true,phone:phone});
        }, (err)=>{
          console.log(err);
        });
    }
  }

}

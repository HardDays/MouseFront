import { Component, OnInit, ElementRef, ViewChild, NgZone, Injectable, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { AuthMainService } from '../services/auth.service';
import { TypeService } from '../services/type.service';
import { ImagesService } from '../services/images.service';
import { AccountService } from '../services/account.service';
import { GenresService} from '../services/genres.service';
import { Router, Params, ActivatedRoute, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { Subscribable } from 'rxjs/Observable';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { error } from 'util';
import { GUID } from '../models/guide.model';
import { AccountCreateModel } from '../models/accountCreate.model';
import { TokenModel } from '../models/token.model';
import { Base64ImageModel } from '../models/base64image.model';
import { AuthService } from "angular2-social-login";
import { UserCreateModel } from '../models/userCreate.model';
import { UserGetModel } from '../models/userGet.model';
import { LoginModel } from '../models/login.model';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { AccountGetModel } from '../models/accountGet.model';
import { EventService } from '../services/event.service';
import { Http, Headers } from '@angular/http';
import { CheckModel } from '../models/check.model';
import { MainService } from '../services/main.service';
import {ArtistFields, BaseImages, BaseMessages, EventFields, FanFields, VenueFields, BaseFields, RequestFields} from './base.enum';
import { MapsAPILoader } from '@agm/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import { CodegenComponentFactoryResolver } from '@angular/core/src/linker/component_factory_resolver';
import { CurrencyIcons } from '../models/preferences.model';
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';
import { SettingsService } from '../services/settings.service';

declare var VK:any;

@Injectable()
export class BaseComponent{


    public isLoading:boolean = true;
    public isLoggedIn:boolean = false;

    public userStatus:number = 0;
    public MyAccounts: AccountGetModel[] = [];
    public accId:number = 0;
    public CurrentAccount:AccountGetModel = new AccountGetModel();
    public MyUser:UserGetModel = new UserGetModel();

    public userCreated:boolean = false;

    public NewErrForUser:boolean = false;

    constructor(
        protected main           : MainService,
        protected _sanitizer     : DomSanitizer,
        protected router         : Router,
        protected mapsAPILoader  : MapsAPILoader,
        protected ngZone         : NgZone,
        protected activatedRoute : ActivatedRoute,
        protected translate      :TranslateService,
        protected settings       :SettingsService
    )
    {
        this.translate.setDefaultLang(this.settings.GetLang());

        this.isLoggedIn = this.main.authService.IsLogedIn();

        this.isLoading = this.main.ActiveProcesses.length > 0;
        if(this.isLoggedIn)
        {
            this.accId = this.GetCurrentAccId();
            this.MyAccounts = this.main.MyAccounts;
            this.CurrentAccount = this.main.CurrentAccount;
            this.MyUser = this.main.MyUser;
        }


        this.main.authService.onAuthChange$
            .subscribe(
                (res:boolean) => {
                    this.isLoggedIn = res;
                    if(this.isLoggedIn)
                    {
                    }
                    else{
                        // this.main.CurrentAccountChange.next(new AccountGetModel());
                        // this.main.MyAccountsChange.next([]);
                        this.router.navigate(['/system','shows']);
                    }

                }
            );

        this.main.ActiveProcessesChanges.subscribe(
            (val:string[]) => {
                if(!this.isLoading && val.length > 0)
                    this.isLoading = true;
                else if(this.isLoading && val.length == 0)
                    this.isLoading = false;
            }
        );

        this.main.CurrentAccountChange
            .subscribe(
                (val:AccountGetModel) =>
                {
                    this.CurrentAccount = val;
                    this.accId = this.CurrentAccount.id;
                }
            );

        this.main.UserChange
            .subscribe(
                (val:UserGetModel) =>
                {
                    this.MyUser = val;
                }
            );

        this.main.MyAccountsChange.subscribe(
            (val:AccountGetModel[]) =>
            {
                this.MyAccounts = val;
            }
        );
    }



    /* PROCESS BLOCK */



    public WaitBeforeLoading = (fun:()=>Observable<any>,success:(result?:any)=>void, err?:(obj?:any)=>void)=>
    {
        this.main.WaitBeforeLoading(
            () => fun(),
            res => success(res),
            error => {
                if(err && typeof err == "function"){
                    err(error);
                }
                if(error.status == 401){

                    this.Logout();

                    return;
                }
            }
        );
    }



    /* PROCESS BLOCK END */



    /* ME BLOCK */

    GetCurrentAccId()
    {
        return this.accId ? this.accId : (this.CurrentAccount.id?this.CurrentAccount.id:+this.main.GetCurrentAccId());
    }


    protected Login(user:LoginModel,callback:(error)=>any,callbackOk?:(res)=>any)
    {
        this.WaitBeforeLoading(
            () => this.main.authService.UserLogin(user),
            (res:TokenModel) => {

                this.main.authService.BaseInitAfterLogin(res);

                this.main.authService.onAuthChange$.next(true);

                this.main.UserChange.first().subscribe(
                    ()=>{
                        // this.main.UserChange.unsubscribe();
                        let admin = this.main.MyUser.is_admin||this.main.MyUser.is_superuser;

                        // console.log(`base login`, admin);
                        if(!admin)
                        {
                            this.router.navigate(['/system','shows']);
                        }
                        else
                        {
                            this.router.navigate(['/admin','dashboard']);
                        }
                    }
                )




                if(callbackOk && typeof callbackOk == "function"){
                    callbackOk(res);
                }
            },
            (err) => {
                // console.log(err);
                callback(err);
                // console.log('asdfasdf');
                //this.main.authService.onAuthChange$.next(false);
            }
        );
    }

    public Logout()
    {
        this.main.authService.Logout();

        VK.init({apiId: 6326995});

        VK.Auth.getLoginStatus((status)=>{
            // console.log(status);
            if(status.session&&status.status!='not_authorized'&&status.status!='unknown'){
                VK.Auth.login((res)=>{
                // console.log(res);
                });

                setTimeout(() => {
                    VK.Auth.logout((res)=>{
                        // console.log(res);
                    });
                }, 1000);

                VK.Observer.subscribe('auth.logout',(res)=>{
                    // console.log(`subscribe`,res);
                })
            }
        })



        this.SocialLogout(`gf`);
        // this.VkLogout();



    }

    protected SocialLogin(provider)
    {
        if(provider=='google' || provider=='facebook')
        {
            this.main._auth.login(provider)
                .subscribe(
                    (data) => {
                        // console.log(provider, data);
                        let socToken:any = data;
                        this.WaitBeforeLoading(
                            () => provider=="google" ? this.main.authService.UserLoginByGoogle(socToken.token) : this.main.authService.UserLoginByFacebook(socToken.token),
                            (res) => {

                            this.isLoading = true;

                           this.main.MyAccountsChange.subscribe(
                            (accs)=>{
                                    this.isLoading = false;
                                    if(this.main.MyAccounts.length>0){
                                    // console.log(`main.MyAccounts.length>0`);
                                    this.router.navigate(['/system','shows']);
                                    }
                                    else
                                    {
                                    // console.log(`create new acc`);
                                    this.router.navigate(['/social']);
                                    }
                                }
                            )

                                this.main.authService.BaseInitAfterLogin(res);
                                this.main.authService.onAuthChange$.next(true);


                                this.isLoading = true;


                                // setTimeout(() => {
                                //     this.isLoading = false;
                                //    if(this.main.MyAccounts.length>0){
                                //     this.router.navigate(['/system','shows']);
                                //    } else {
                                //     //    console.log(`create new acc`);
                                //        this.router.navigate(['/social']);
                                //    }
                                // }, 3000);




                            }
                        );
                    }
                )
        }
        else if(provider=='vk'){}
    }

    protected SocialLogout(provider)
    {
        if(provider=='gf')
        {
            this.main._auth.logout()
                .subscribe(
                    (data) => {//return a boolean value.
                        this.main.authService.onAuthChange$.next(false);
                    }
                );
        }
    }

    VkLogout(){

        // window.location.replace("https://api.vk.com/method/authorize?client_id=6326995&display=page&redirect_uri=https://mouse-web.herokuapp.com/login&scope=friends&response_type=token&v=5.73&scope=offline");
  }

    CreateAcc(account:AccountCreateModel,callbackOk:(res)=>any,callback:(error)=>any)
    {
        this.main.authService.CreateAccount(account)
            .subscribe(
                (acc) => {
                    this.accId = acc.id;
                    this.main.SetCurrentAccId(this.accId);
                    this.main.authService.onAuthChange$.next(true);
                    callbackOk(acc);
                },
                (err) => {
                    callback(err);
                }
            );
    }


    /* Service Process BLOCK */

    protected ReadImages(files:any,callback?:(params?)=>any)
    {
        for(let f of files)
        {
            let file:File = f;
            if(!file)
               break;

            let myReader:FileReader = new FileReader();
            myReader.onloadend = (e) => {
                callback(myReader.result);
            }
            myReader.readAsDataURL(file);
        }
    }

    /* Service Process BLOCK END */




    convertToCheckModel<T>(model)
    {
        let checkModel:CheckModel<T> = new CheckModel(model);
        return checkModel;
    }
    convertArrToCheckModel<T>(model:T[])
    {
        let arrCheck: CheckModel<T>[] = [];
        for(let i of model) arrCheck.push(this.convertToCheckModel(i));
        return arrCheck;
    }

    MaskTelephone()
    {
        return {
          // mask: ['+',/[1-9]/,' (', /[1-9]/, /\d/, /\d/, ') ',/\d/, /\d/, /\d/, '-', /\d/, /\d/,'-', /\d/, /\d/],
          mask: ['+',/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/],
          keepCharPositions: true,
          guide:false
        };
    }

    MaskNumbers()
    {
        return {
            // mask: ['+',/[1-9]/,' (', /[1-9]/, /\d/, /\d/, ') ',/\d/, /\d/, /\d/, '-', /\d/, /\d/,'-', /\d/, /\d/],
            mask: [/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/],
            keepCharPositions: true,
            guide:false
        };
    }

    MaskDays(){
        return{
            mask: [/[1-9]/,/[0-9]/],
            keepCharPositions: true,
            guide:false
        };
    }
    MaskPrice()
    {
        let CurrencySymbol = "$";
        if(this.main.settings.GetCurrency() == 'RUB'){
            CurrencySymbol = 'Р.';
          }
          else{
            CurrencySymbol = CurrencyIcons[this.main.settings.GetCurrency()];
          }

        return {
            // mask: ['+',/[1-9]/,' (', /[1-9]/, /\d/, /\d/, ') ',/\d/, /\d/, /\d/, '-', /\d/, /\d/,'-', /\d/, /\d/],
            mask: [CurrencySymbol,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/],
            keepCharPositions: true,
            guide:false
        };
    }

    MaskSpotify()
    {
        return {
            // mask: ['+',/[1-9]/,' (', /[1-9]/, /\d/, /\d/, ') ',/\d/, /\d/, /\d/, '-', /\d/, /\d/,'-', /\d/, /\d/],
            mask: ['h','t','t','p','s',':','/','/','o','p','e','n','.','s','p','o','t','i','f','y','.','c','o','m','/',/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./],
            keepCharPositions: false,
            guide:false
        };
    }

    MaskSoundCloud()
    {
        return {

            // mask: ['+',/[1-9]/,' (', /[1-9]/, /\d/, /\d/, ') ',/\d/, /\d/, /\d/, '-', /\d/, /\d/,'-', /\d/, /\d/],
            mask: ['h','t','t','p','s',':','/','/','s','o','u','n','d','c','l','o','u','d','.','c','o','m','/',/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./],
            keepCharPositions: false,
            guide:false
        };
    }

    MaskYoutube()
    {
        return {

            // mask: ['+',/[1-9]/,' (', /[1-9]/, /\d/, /\d/, ') ',/\d/, /\d/, /\d/, '-', /\d/, /\d/,'-', /\d/, /\d/],
            mask: ['h','t','t','p','s',':','/','/','y','o','u','t','u','.','b','e','/',/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./,/./],
            keepCharPositions: false,
            guide:false
        };
    }

    WithoutSpace()
    {
        return {

            mask: [/\S/, /\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/,/\S/],
            keepCharPositions: false,
            guide:false
        };
    }

    MaskPhoneByFormat(code)
    {
        // console.log(code);
        let countryMask:any[]=[];
        let isGuidChar = true;
        let dial_code = code.dial_code;
        if(code.format){
            for(let c of code.format){
                if(c==='.')
                {
                    if(dial_code){

                        let dc = dial_code[0];
                        // console.log(dial_code,dc);
                        dial_code = dial_code.slice(1, dial_code.length);
                        countryMask.push(dc);
                    }
                    else
                        countryMask.push(/\d/);
                }
                else
                    countryMask.push(c);
            }
        }

        else{
            isGuidChar = false;
            countryMask.push('+');
            for(let c of code.dial_code)
                countryMask.push(c);
            for(let i=0;i<10;i++)
                countryMask.push(/\d/);
        }
        return {
          mask: countryMask,
          keepCharPositions: true,
          guide:isGuidChar
        };
    }

    MaskPhone(phone:string)
    {
        // console.log(phone)
        let countryMask:any[]=[];
        let isGuidChar = true;

        if(phone&&phone.length>0&&phone.replace(new RegExp('_', 'g'),'')!='+'){
            let codes = this.main.phoneService.GetAllPhoneCodesWithFormat();
            //console.log(`codes`,codes);
            let code_arr = codes.filter((c)=>phone.indexOf(c.dial_code)>0&&phone.indexOf(c.dial_code)<4);
            let code = code_arr.find((c)=>phone[1]===c.dial_code);
            if(!code)code = code_arr[0];
            let dial_code = code.dial_code;
            if(code['format']){
                for(let c of code['format']){
                    if(c==='.')
                    {
                        if(dial_code){

                            let dc = dial_code[0];
                            // console.log(dial_code,dc);
                            dial_code = dial_code.slice(1, dial_code.length);
                            countryMask.push(dc);
                        }
                        else
                            countryMask.push(/\d/);
                    }
                    else
                        countryMask.push(c);
                }
            }

            else {
                isGuidChar = false;
                countryMask.push('+');
                for(let c of code.dial_code)
                    countryMask.push(c);
                for(let i=0;i<10;i++)
                    countryMask.push(/\d/);
            }
        }
        else{
            let isGuidChar = false;
            countryMask.push('+');
            for(let i=0;i<12;i++)
                countryMask.push(/\d/);
        }

        // let codes = this.main.phoneService.GetAllPhoneCodesWithFormat();
        // console.log(`codes`,codes);
        // let code = codes.find((c)=>phone.indexOf(c.dial_code)>0&&phone.indexOf(c.dial_code)<4);
        // console.log(`code`,code,phone)
        // console.log(code);

        // let dial_code = code.dial_code;
        // if(code.format){
        //     for(let c of code.format){
        //         if(c==='.')
        //         {
        //             if(dial_code){

        //                 let dc = dial_code[0];
        //                 // console.log(dial_code,dc);
        //                 dial_code = dial_code.slice(1, dial_code.length);
        //                 countryMask.push(dc);
        //             }
        //             else
        //                 countryMask.push(/\d/);
        //         }
        //         else
        //             countryMask.push(c);
        //     }
        // }

        // else {
        //     isGuidChar = false;
        //     countryMask.push('+');
        //     for(let c of code.dial_code)
        //         countryMask.push(c);
        //     for(let i=0;i<10;i++)
        //         countryMask.push(/\d/);
        // }





    //    console.log(countryMask);

        return {
          mask: countryMask,
          keepCharPositions: true,
          guide:isGuidChar,
          showMask:true
        };
    }

    ConvertPhoneToCountry(val){
      if(!val)
        return '';

        let phone = '';
        // console.log(`val`,val);

        let codes = this.main.phoneService.GetAllPhoneCodesWithFormat();

        let code_arr = codes.filter((c)=>val.indexOf(c.dial_code)>0&&val.indexOf(c.dial_code)<4);
        let code = code_arr.find((c)=>val[1]===c.dial_code);

        if(!code)code = code_arr[0];

        if(code['format']){
            // console.log(`format`,code['format']);
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

    /* AUTOCOMPLETE */
    @ViewChild('search') public searchElement: ElementRef;
    protected CreateAutocomplete( callback:(addr:string[], place?:google.maps.places.PlaceResult)=>any)
    {
        this.mapsAPILoader.load().then(
            () => {
                let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement);
                autocomplete.addListener(
                    "place_changed",
                    () => {
                        // console.log(`place_changed`);
                        this.ngZone.run(
                            () => {
                                let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                                if(place.geometry === undefined || place.geometry === null )
                                {
                                    return;
                                }
                                else
                                {
                                    // let addr:string[] = autocomplete.getPlace().adr_address.split(', ');
                                    let addr:string[] = autocomplete.getPlace().adr_address.split('/span>');
                                    if(callback && typeof callback == "function")
                                    {
                                        callback(addr,place);
                                    }
                                }
                            }
                        );
                    }
                );
            }
        );
    }

    /* Error messages */
    private getKeysDict(entityType: string) {
      if (entityType === 'venue') {
        return VenueFields;
      } else if (entityType === 'artist') {
        return ArtistFields;
      } else if (entityType === 'fan') {
        return FanFields;
      } else if (entityType === 'event') {
        return EventFields;
      } else if(entityType === 'request') {
        return RequestFields;
      } else if (entityType === 'base') {
        return BaseFields;
      }
    }

    private getFieldError(field: FormControl, key: string, keyDict: any)
    {
        if (field.errors !== null)
        {
            if (field.errors.hasOwnProperty('required'))
            {
                let strEr = (BaseMessages.RequiredField).replace('_field', keyDict[key]);
                strEr = this.GetTranslateString(strEr)?this.GetTranslateString(strEr):strEr;
                return String(strEr)
            }
            else if (field.errors.hasOwnProperty('email'))
            {
                let strEr = (BaseMessages.EmailField).replace('_email', keyDict[key]);
                strEr = this.GetTranslateString(strEr)?this.GetTranslateString(strEr):strEr;
                return String(strEr)
            }
            else if (field.errors.hasOwnProperty('maxlength'))
            {
                let strEr = (BaseMessages.MaxLength).replace(
                    '_field', keyDict[key]
                  ).replace('_length', field.errors['maxlength'].requiredLength);
                strEr = this.GetTranslateString(strEr)?this.GetTranslateString(strEr):strEr;
                return String(strEr)
            }
            else if (field.errors.hasOwnProperty('pattern'))
            {
              if (key === 'email' || key === 'artist_email') {
                let strEr = (BaseMessages.EmailPattern).replace('_email', keyDict[key]);
                strEr = this.GetTranslateString(strEr)?this.GetTranslateString(strEr):strEr;
                return String(strEr)
              }
              else if (key === 'link'){
                let strEr = (BaseMessages.LinkPattern).replace('_link', keyDict[key]);
                strEr = this.GetTranslateString(strEr)?this.GetTranslateString(strEr):strEr;
                return String(strEr)
              }
              else
              {
                let strEr = (BaseMessages.NumberPattern).replace('_field', keyDict[key]);
                strEr = this.GetTranslateString(strEr)?this.GetTranslateString(strEr):strEr;
                return String(strEr)
              }
            }
        }
    }

    protected getFormErrorMessage(form: FormGroup, entityType: string) {
        const errors = [];

        const keyDict = this.getKeysDict(entityType);


        Object.keys(form.controls).forEach((key) => {
            if (form.controls[key].status === 'INVALID') {
                const formControl = form.controls[key];
                // console.log(`---`,formControl,key);
                if (formControl instanceof FormControl) {
                    errors.push(this.getFieldError(formControl, key, keyDict));
                }
                else if (formControl instanceof FormArray) {
                    // y formArray свой controls, который массив из FormControls и у каждого свои controls
                    formControl.controls.forEach((arrElem: FormGroup) => {
                        Object.keys(arrElem.controls).forEach((i) => {
                          if (arrElem.controls[i].status === 'INVALID') {
                            errors.push(this.getFieldError(<FormControl>arrElem.controls[i], i, keyDict));
                          }
                        });
                    });
                }
            }

        });

        return (errors.length > 3)?BaseMessages.AllFields : errors.join('<br/>');
    }

    protected getResponseErrorMessage(err: Response, entityType='base') {
      const errors = [];
      const keyDict = this.getKeysDict(entityType);
      Object.keys(err.json()).forEach((key) => {
            let error = err.json()[key][0];
            // const str = error? this.GetTranslateString(error.replace('_', ' ')):null;

            errors.push(this.GetTranslateString(keyDict[key]) + ' ' + (error? this.GetTranslateString(error.replace('_', ' ').toLowerCase()):'').toLowerCase());
      });
    //   console.log(errors);
      return errors.join('<br/>');
    }

      /* AUTOCOMPLETE */

      isEnglish(){
          if(this.settings.GetLang() == 'en')
            return true;
        }

    GetTranslateString(str:string):string
    {
        return this.translate.parser.getValue(this.translate.store.translations[this.settings.GetLang()],str);
    }

}

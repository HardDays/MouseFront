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
import {ArtistFields, BaseImages, BaseMessages, EventFields, FanFields, VenueFields, BaseFields} from './base.enum';
import { MapsAPILoader } from '@agm/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import { CodegenComponentFactoryResolver } from '../../../../node_modules/@angular/core/src/linker/component_factory_resolver';

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
        protected activatedRoute : ActivatedRoute
    )
    {
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
                    //console.log("acc_change",val);
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
                this.router.navigate(['/system','shows']);
                this.main.authService.onAuthChange$.next(true);

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
        this.SocialLogout(`gf`);
    }

    protected SocialLogin(provider)
    {
        if(provider=='google' || provider=='facebook')
        {
            this.main._auth.login(provider)
                .subscribe(
                    (data) => {
                        let socToken:any = data;
                        this.WaitBeforeLoading(
                            () => provider=="google" ? this.main.authService.UserLoginByGoogle(socToken.token) : this.main.authService.UserLoginByFacebook(socToken.token),
                            (res) => {
                                this.main.authService.BaseInitAfterLogin(res);
                                this.main.authService.onAuthChange$.next(true);

                                setTimeout(() => {
                                   if(this.main.MyAccounts.length>0){
                                    this.router.navigate(['/system','shows']);
                                   } else {
                                    //    console.log(`create new acc`);
                                       this.router.navigate(['/social']);
                                   }
                                }, 1000);
                                
                               
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
    

    MaskPrice()
    {
        return {
            // mask: ['+',/[1-9]/,' (', /[1-9]/, /\d/, /\d/, ') ',/\d/, /\d/, /\d/, '-', /\d/, /\d/,'-', /\d/, /\d/],
            mask: ['$',/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/],
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

    MaskPhone(phone)
    {   
        //console.log(phone)
        let countryMask:any[]=[];
        let isGuidChar = true;

        if(phone){
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
      } else if (entityType === 'base') {
        return BaseFields;
      }
    }

    private getFieldError(field: FormControl, key: string, keyDict: any)
    {
        // console.log(key, keyDict);
        if (field.errors !== null)
        {
            if (field.errors.hasOwnProperty('required'))
            {
                return String(BaseMessages.RequiredField).replace('_field', keyDict[key]);
            }
            else if (field.errors.hasOwnProperty('email'))
            {
                return String(BaseMessages.EmailField).replace('_email', keyDict[key]);
            }
            else if (field.errors.hasOwnProperty('maxlength'))
            {
                return String(BaseMessages.MaxLength).replace(
                  '_field', keyDict[key]
                ).replace('_length', field.errors['maxlength'].requiredLength);
            }
            else if (field.errors.hasOwnProperty('pattern'))
            {
              if (key === 'email' || key === 'artist_email') {
                return String(BaseMessages.EmailPattern).replace('_email', keyDict[key]);
              }
              else if (key === 'link'){
                return String(BaseMessages.LinkPattern).replace('_link', keyDict[key]);
              }
              else
              {
                return String(BaseMessages.NumberPattern).replace('_filed', keyDict[key]);
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
          errors.push(keyDict[key] + ' ' + (error?error.replace('_', ' '):'').toLowerCase());
      });

      return errors.join('<br/>');
    }

      /* AUTOCOMPLETE */



}

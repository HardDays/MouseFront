import { Component, OnInit, ElementRef, ViewChild, NgZone, Injectable, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { AuthMainService } from '../services/auth.service';
import { TypeService } from '../services/type.service';
import { ImagesService } from '../services/images.service';
import { AccountService } from '../services/account.service';
import { GenresService} from '../services/genres.service';
import { Router, Params, ActivatedRoute } from '@angular/router';

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
import {ArtistFields, BaseImages, BaseMessages, EventFields, FanFields, VenueFields} from './base.enum';
import { MapsAPILoader } from '@agm/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

@Injectable()
export class BaseComponent{


    public isLoading:boolean = true;
    public isLoggedIn:boolean = false;

    public userStatus:number = 0;
    public MyAccounts: AccountGetModel[] = [];
    public accId:number = 0;
    public CurrentAccount:AccountGetModel = new AccountGetModel();

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
        }

        this.main.authService.onAuthChange$
            .subscribe(
                (res:boolean) => {
                    // console.log('loggedIn',res);
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
                callback(err);
                this.main.authService.onAuthChange$.next(false);
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
                                this.router.navigate(['/system','shows']);
                                this.main.authService.onAuthChange$.next(true);
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
            mask: [/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,,/\d/,/\d/,/\d/],
            keepCharPositions: true,
            guide:false
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
                                    let addr:string[] = autocomplete.getPlace().adr_address.split(', ');

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

    private getFieldError(field: FormControl, key: string)
    {
        if (field.errors !== null)
        {
            if (field.errors.hasOwnProperty('required'))
            {
                return String(BaseMessages.RequiredField).replace('_field', key);
            }
            else if (field.errors.hasOwnProperty('email'))
            {
                return String(BaseMessages.EmailField).replace('_email', key);
            }
            else if (field.errors.hasOwnProperty('maxlength'))
            {
                return String(BaseMessages.MaxLength).replace(
                  '_field', key
                ).replace('_length', field.errors['maxlength'].requiredLength);
            }
        }
    }

    protected getFormErrorMessage(form: FormGroup, entityType: string) {
        const errors = [];
        const keyDict = this.getKeysDict(entityType);
        console.log(entityType);
        console.log(keyDict);

        Object.keys(form.controls).forEach((key) => {
            if (form.controls[key].status === 'INVALID') {
                const formControl = form.controls[key];
                console.log(formControl);

                if (formControl instanceof FormControl) {
                    errors.push(this.getFieldError(formControl, keyDict[key]));
                }
                else if (formControl instanceof FormArray) {
                    // y formArray свой controls, который массив из FormControls и у каждого свои controls
                    formControl.controls.forEach((arrElem: FormGroup) => {
                        Object.keys(arrElem.controls).forEach((i) => {
                          if (arrElem.controls[i].status === 'INVALID') {
                            errors.push(this.getFieldError(<FormControl>arrElem.controls[i], keyDict[i]));
                          }
                        });
                    });
                }
            }
        });
        console.log(errors.join('<br/>'));
        return errors.join('<br/>');
    }

    protected getResponseErrorMessage(err: Response, entityType='base') {
      const errors = [];
      const keyDict = this.getKeysDict(entityType);

      Object.keys(err.json()).forEach((key) => {
        for (let error of err.json()[key]) {
          errors.push(keyDict[key] + ' ' + error.replace('_', ' ').toLowerCase());
        }
      });

      return errors.join('<br/>');
    }

      /* AUTOCOMPLETE */



}

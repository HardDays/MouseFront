import { Component, OnInit, ElementRef, ViewChild, NgZone, Injectable } from '@angular/core';
import { AuthMainService } from '../services/auth.service';
import { TypeService } from '../services/type.service';
import { ImagesService } from '../services/images.service';
import { AccountService } from '../services/account.service';
import { GenresService} from '../services/genres.service';
import { Router, Params } from '@angular/router';

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
import { BaseImages } from './base.enum';

@Injectable()
export class BaseComponent{

    
    public isLoading:boolean = false;
    public isLoggedIn:boolean = false;

    public userStatus:number = 0;
    public MyAccounts: AccountGetModel[] = [];
    public accId:number = 0;
    public CurrentAccount:AccountGetModel = new AccountGetModel();

    public MyLogo:string = '';
    public userCreated:boolean = false;

    public NewErrForUser:boolean = false;

    public ActiveProcesses:string[] = [];
    
    constructor(
        protected main       : MainService,
        protected _sanitizer : DomSanitizer,
        protected router     : Router
    ) 
    {
        this.isLoggedIn = this.main.authService.IsLogedIn();

        if(this.isLoggedIn)
        {
            this.GetMyAccounts();
        }

        this.main.onAuthChange$
            .subscribe(
                (res:boolean) => {
                    console.log('loggedIn',res);
                    this.isLoggedIn = res;
                    if(this.isLoggedIn)
                    {
                        this.GetMyAccounts();      
                    }
                    else{
                        this.main.CurrentAccountChange.next(new AccountGetModel());
                        this.main.MyAccountsChange.next([]);
                        this.router.navigate(['/system','shows']);
                    }
                
                }
            );

        this.main.onLoadingChange$
            .subscribe(
                (val:boolean) => {
                    if(this.ActiveProcesses.length == 0){
                        this.isLoading = false;
                    }
                    else{
                        this.isLoading = true;
                    }
                }
            ); 
            
        this.main.CurrentAccountChange
            .subscribe(
                (val:AccountGetModel) =>
                {
                    this.CurrentAccount = val;
                    this.accId = this.CurrentAccount.id;
                    this.GetMyLogo();
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

    private GenerateProcessID()
    {
        let id:string = GUID.GetNewGUID();
        this.ActiveProcesses.push(id);
        this.SetLoading();
        return id;
    }

    private DeleteProcess(str:string)
    {
        let index = this.ActiveProcesses.findIndex(x=>x == str);
        this.ActiveProcesses.splice(index,1);
        this.SetLoading();
    }
    
    public WaitBeforeLoading = (fun:()=>Observable<any>,success:(result?:any)=>void, err?:(obj?:any)=>void)=>
    {
        let process = this.GenerateProcessID();
        fun()
            .subscribe(
                res => {
                    success(res);
                    this.DeleteProcess(process);
                },
                error => {                    
                    if(err && typeof err == "function"){
                        err(error); 
                    }
                    this.DeleteProcess(process);
                    if(error.status == 401){

                        this.Logout();

                        return;
                    }
                }
            );
    }

    public SetLoading()
    {
        this.main.onLoadingChange$.next(true);
    }

    /* PROCESS BLOCK END */



    /* ME BLOCK */

    GetCurrentAccId()
    {
        return this.accId ? this.accId : (this.CurrentAccount.id?this.CurrentAccount.id:+this.main.GetCurrentAccId());
    }

    protected GetMyAccounts(callback?:()=>any,callbackOk?:()=>any){
        this.WaitBeforeLoading(
            () => this.main.accService.GetMyAccount(),
            (res) => {
                this.MyAccounts = res;
                if(this.MyAccounts.length > 0)
                {
                    if(this.main.GetCurrentAccId())
                    {
                        this.accId = +this.main.GetCurrentAccId();
                        this.CurrentAccount = this.MyAccounts.find((acc) => acc.id == this.accId);
                    }
                    else
                    {
                        this.CurrentAccount = this.MyAccounts[0];
                        this.accId = this.CurrentAccount.id;
                    }
                }
                else this.accId = 0;

                this.main.CurrentAccountChange.next(this.CurrentAccount);
                this.main.MyAccountsChange.next(this.MyAccounts);
                if(callbackOk && typeof callbackOk == "function")
                {
                    callbackOk();
                }
            },
            (err) => {
                if(callback && typeof callback == "function")
                {
                    callback();
                }
            }
        );
    }

    protected GetMyLogo()
    {
        if(this.CurrentAccount && this.CurrentAccount.image_id)
        {
            this.WaitBeforeLoading(
                () => this.main.imagesService.GetImageById(this.CurrentAccount.image_id),
                (res:Base64ImageModel) =>
                {
                    this.MyLogo = res.base64?res.base64:BaseImages.Drake;
                } 
            );
        }
        else{
            this.MyLogo = BaseImages.Drake;
        }
    }

    protected Login(user:LoginModel,callback:(error)=>any,callbackOk?:(res)=>any)
    {
        this.WaitBeforeLoading(
            () => this.main.authService.UserLogin(user),
            (res:TokenModel) => {
                this.main.authService.BaseInitAfterLogin(res);
                this.router.navigate(['/system','shows']);
                this.main.onAuthChange$.next(true);

                if(callbackOk && typeof callbackOk == "function"){
                    callbackOk(res);
                }
            },
            (err) => {
                callback(err);
                this.main.onAuthChange$.next(false);
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
                                this.main.onAuthChange$.next(true);
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
                        this.main.onAuthChange$.next(false);
                    } 
                );
        }
    }


    CreateUserAcc(user:UserCreateModel, account:AccountCreateModel,callback:(error)=>any)
    {
        if(!this.userCreated)
        { 
            this.WaitBeforeLoading(
                () => this.main.authService.CreateUser(user),
                (res:UserGetModel)=> {
                    this.main.authService.BaseInitAfterLogin(new TokenModel(res.token));
                    this.userCreated = true;
                    this.main.onAuthChange$.next(true);
                },
                (err) => {
                    callback(err);
                    this.main.onAuthChange$.next(false);
                }
            );
        }
    }



    CreateUser(user:UserCreateModel, callbackOk:(res)=>any, callbackErr:(error)=>any)
    {
        this.userCreated = false;
        this.WaitBeforeLoading(
            ()=>this.main.authService.CreateUser(user),
            (res:UserGetModel) => {
                this.main.authService.BaseInitAfterLogin(new TokenModel(res.token));
                this.userCreated = true;
                this.main.onAuthChange$.next(true);
                callbackOk(res);
            },
            (err) => {
                callbackErr(err);
                this.main.onAuthChange$.next(false);
            }
        );
    }

    CreateAcc(account:AccountCreateModel,callbackOk:(res)=>any,callback:(error)=>any)
    {
        this.main.authService.CreateAccount(account)
            .subscribe(
                (acc) => {
                    this.accId = acc.id;
                    this.main.SetCurrentAccId(this.accId);
                    this.main.onAuthChange$.next(true);
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

   

   

    // protected GetImageById(id:number,callback:(res:any)=>any, errCallback?:(obj?:any)=>void){
    //     if(id){
    //         this.WaitBeforeLoading(
    //             ()=>this.service.GetImageById(id),
    //             (res:Base64ImageModel)=>{
    //                 if(callback && typeof callback == "function"){
    //                     callback(res);
    //                 }
    //             },
    //             (err)=>{
    //                 console.log(err);

    //                 if(callback && typeof callback == "function"){
    //                     callback(false);
    //                 }
    //                 if(errCallback && typeof errCallback == "function"){
    //                     errCallback();
    //                 }
    //             }
    //         );
    //     }
    //     else{
    //         if(callback && typeof callback == "function"){
    //             callback(false);
    //         }
    //     }
    // }

    // protected GetMyImage(callback?:()=>any){
    //     this.GetImageById(
    //         this.Me.image_id,
    //         (res:Base64ImageModel)=>{
    //             this.MyLogo = res.base64;
    //             if(callback && typeof callback == "function"){
    //                 callback();
    //             }
    //         }
    //     ); 
    // }
    
    
    
    // protected GetMyAccess(callback?:(params:any)=>void){
    //     this.WaitBeforeLoading(
    //         ()=>this.service.GetMyAccess(),
    //         (res:any)=>{
    //             this.SetUserStatus(res.role);
               
    //             if(callback && typeof callback == "function"){
    //                 callback(res);
    //             }
    //         },
    //         (err)=>{
    //             this.SetUserStatus('');
    //             if(callback && typeof callback == "function"){
    //                  callback(false);
    //             }
    //         }
    //     );
    // }


    // private SetUserStatus(role:string, first?:boolean){
        
        

    //     this.service.SetupLocalUserStatus(this.userStatus);


    //     if(+this.userStatus <= 1){
    //         this.Logout();
    //         this.NewErrForUser = true;
    //     } 
        
    //     else{
    //         this.NewErrForUser = false;
    //         if(location.pathname=='/login' || location.pathname=='/system/registration')
    //         {  
    //             this.router.navigate(['/system','table']);
    //             //location.reload();
    //         }
    //     }

    // }


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

      

}
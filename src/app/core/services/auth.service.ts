import { Injectable } from "@angular/core";
import { Http, URLSearchParams } from '@angular/http';
import { HttpService } from './http.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';
import {TokenModel} from "./../models/token.model";
import { AccountCreateModel } from "./../models/accountCreate.model";
import { UserCreateModel } from "../models/userCreate.model";
import { UserGetModel } from "../models/userGet.model";
import { LoginModel } from "../models/login.model";

@Injectable()
export class AuthMainService{

    public onAuthChange$: Subject<boolean>;
    public me: AccountCreateModel;
    public onLoadingChange$: Subject<boolean>;
    public stupidAccessShow:boolean = true;
  
    constructor(private http: HttpService, private router: Router){
        this.onAuthChange$ = new Subject();
        this.onAuthChange$.next(false);
        this.onLoadingChange$ = new Subject();
        this.onLoadingChange$.next(false);
        this.me = new AccountCreateModel();
    }

    IsLogedIn():boolean{
        let token = this.http.GetToken();
        if(!token || !token.token)
            return false;
        return true;
    }


    getToken()
    {
        return this.http.GetToken();
    }


    UserLogin(user:LoginModel){

        let paramsUserName = {
            user_name: user.user,
            password: user.password
        };

        let paramsEmail = {
            email: user.user,
            password: user.password
        };

        let params;
        if(user.user.search('@')>0) 
            params = paramsEmail;
        else params = paramsUserName;

        return this.http.PostData('/auth/login.json',JSON.stringify(params));
    }



    UserLoginByGoogle(token:string){
        let params = {
            access_token: token
        };
        return this.http.PostData('/auth/google.json',JSON.stringify(params));
    }


    UserLoginByFacebook(token:string){
        let params = {
            access_token: token
        };
        return this.http.PostData('/auth/facebook.json',JSON.stringify(params));
    }


    SetupLocalUserStatus(status){
        try{
            localStorage.setItem('userStatus',status+"");
        }
        catch(err){
            console.log(err);
        }
    }

    // GetLocalUserStatus():number{
    //     try{
    //         return +localStorage.getItem('userStatus');
    //     }
    //     catch(err){
    //         console.log(err);
    //         return UserEnumStatus.None;
    //     }
    // }

    BaseInitAfterLogin(data:TokenModel){
        localStorage.setItem('token',data.token);
        this.http.BaseInitByToken(data.token);
        // this.GetMe()
        //     .subscribe((user:UserGetModel)=>{
        //         this.me = user;
        //         this.onAuthChange$.next(true);
        //     });
    }

    TryToLoginWithToken()
    {
        let token = localStorage.getItem('token');
        if(token)
        {
            this.BaseInitAfterLogin(new TokenModel(token));
        }
    }


    ClearSession(){
        this.http.token = null;
        this.http.headers.delete('Authorization');
        this.onAuthChange$.next(false);
        localStorage.removeItem('token');
        console.log('localStorage.removeItem deleted');
    }


    Logout(){
        return this.http.PostData("/auth/logout.json","{}")
            .subscribe(()=>{
                this.ClearSession();
            });            
    }

    
    GetMe(){
        return this.http.GetData('/users/me.json',"");
    }

    CreateUser(user:UserCreateModel){
        return this.http.PostData('/users.json',JSON.stringify(user));
    }

    CreateAccount(acc:AccountCreateModel){
        return this.http.PostData('/accounts.json',JSON.stringify(acc));
    }

    ForgotPassword(user:string){
        let paramsUserName = {
            user_name: user
        };

        let paramsEmail = {
            email: user
        };
        let params;
        if(user.search('@')>0) 
            params = paramsEmail;
        else params = paramsUserName;

        console.log('params',params);
        return this.http.PostData('/auth/forgot_password.json',JSON.stringify(params));
    }



}
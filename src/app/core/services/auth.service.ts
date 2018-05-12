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
import { TypeService } from './type.service';
import { FrontWorkingTimeModel } from "../models/frontWorkingTime.model";
import { WorkingTimeModel } from '../models/workingTime.model';
import { ContactModel } from "../models/contact.model";
import { EventDateModel } from "../models/eventDate.model";

@Injectable()
export class AuthMainService{

    public onAuthChange$: Subject<boolean>;
    public me: AccountCreateModel;
    public onLoadingChange$: Subject<boolean>;
    public stupidAccessShow:boolean = true;
  
    constructor(private http: HttpService, private router: Router, private typeService:TypeService){
        this.onAuthChange$ = new Subject();
        this.onAuthChange$.next(false);
        this.onLoadingChange$ = new Subject();
        this.onLoadingChange$.next(false);
        this.me = new AccountCreateModel();
    }

    IsLogedIn():boolean{
        let token = this.GetToken();
        if(!token || !token.token)
            return false;
        return true;
    }


    GetToken()
    {
        return this.http.GetToken();
    }


    UserLogin(user:LoginModel){

        let paramsUserName = {
            user_name: user.user,
            password: user.password
        };

        let paramsEmail = {
            email: user.user.toLowerCase(),
            password: user.password
        };

        let params;
        if(user.user.search('@')>0) 
            params = paramsEmail;
        else params = paramsUserName;

        return this.http.CommonRequest(
            ()=> this.http.PostData('/auth/login.json',JSON.stringify(params))
        );
    }
    UserLoginByGoogle(token:string){
        let params = {
            access_token: token
        };
        return this.http.CommonRequest(
            ()=> this.http.PostData('/auth/google.json',JSON.stringify(params))
        );
    }


    UserLoginByFacebook(token:string){
        let params = {
            access_token: token
        };
        return this.http.CommonRequest(
            ()=> this.http.PostData('/auth/facebook.json',JSON.stringify(params))
        );
    }

    // UserLoginByTwitter(token:string, secret_token:string){
    //     let params = {
    //         access_token: token,
    //         access_token_secret: secret_token
    //     };
    //     return this.http.CommonRequest(
    //         ()=> this.http.PostData('/auth/twitter.json',JSON.stringify(params))
    //     );
    // }

    UserLoginByVk(token:string){
        let params = {
            access_token: token
        };
        return this.http.CommonRequest(
            ()=> this.http.PostData('/auth/vk.json',JSON.stringify(params))
        );
    }
    GetDataFromVk(){
        return this.http.GetDataFromOtherUrl('https://oauth.vk.com/authorize?client_id=6412516&display=page&response_type=token&v=5.73&state=123456');
    }

    // GetDataFromTwitter(){
    //     return this.http.GetDataFromOtherUrl('https://api.twitter.com/oauth/authorize?client_id=923927835315785728&display=page&redirect_uri=https://mouse-web.herokuapp.com/login&scope=friends&response_type=token&v=5.73&scope=offline');
    // }


    SetupLocalUserStatus(status){
        try{
            localStorage.setItem('userStatus',status+"");
        }
        catch(err){
        }
    }

    BaseInitAfterLogin(data:TokenModel){
        localStorage.setItem('token',data.token);
        this.http.BaseInitByToken(data.token);
    }

    TryToLoginWithToken()
    {
        let token = localStorage.getItem('token');
        if(token)
        {
            this.BaseInitAfterLogin(new TokenModel(token));
            this.onAuthChange$.next(true);
        }
    }


    ClearSession(){
        this.http.token = null;
        this.http.headers.delete('Authorization');
        this.onAuthChange$.next(false);
        localStorage.removeItem('token');
        localStorage.removeItem('activeUserId');
    }


    Logout(){
        return this.http.CommonRequest(
            ()=> this.http.PostData("/auth/logout.json","{}")
        ).subscribe(()=>{
            this.ClearSession();
        });          
    }

    
    GetMe(){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/users/me.json',"")
        );
    }

    CreateUser(user:UserCreateModel){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/users.json',JSON.stringify(user))
        );
    }

    CreateAccount(acc:AccountCreateModel){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/accounts.json',JSON.stringify(acc))
        );
    }

    ForgotPassword(user:string, email:string){
        let params = {
            user_name: user,
            email: email
        };

        return this.http.CommonRequest(
            ()=> this.http.PostData('/auth/forgot_password.json',JSON.stringify(params))
        );
    }

    UserPatchPassword(password:string, old_password:string){
        let params = {
            old_password:old_password,
            password:password,
            password_confirmation:password
        }
        return this.http.CommonRequest(
            ()=> this.http.PatchData('/users/me.json',JSON.stringify(params))
        );

    }

    // Twitter(){
    //     return this.http.Twitter();
    // }


}
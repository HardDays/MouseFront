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

        return this.http.CommonRequest(
            ()=> this.http.PostData('/auth/login.json',JSON.stringify(params))
        );

        //return this.http.PostData('/auth/login.json',JSON.stringify(params));
    }



    UserLoginByGoogle(token:string){
        let params = {
            access_token: token
        };
        return this.http.CommonRequest(
            ()=> this.http.PostData('/auth/google.json',JSON.stringify(params))
        );
        //return this.http.PostData('/auth/google.json',JSON.stringify(params));
    }


    UserLoginByFacebook(token:string){
        let params = {
            access_token: token
        };
        return this.http.CommonRequest(
            ()=> this.http.PostData('/auth/facebook.json',JSON.stringify(params))
        );
        //return this.http.PostData('/auth/facebook.json',JSON.stringify(params));
    }


    SetupLocalUserStatus(status){
        try{
            localStorage.setItem('userStatus',status+"");
        }
        catch(err){
            console.log(err);
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
        return this.http.CommonRequest(
            ()=> this.http.PostData("/auth/logout.json","{}")
        ).subscribe(()=>{
            this.ClearSession();
        });
        // return this.http.PostData("/auth/logout.json","{}")
        //     .subscribe(()=>{
        //         this.ClearSession();
        //     });            
    }

    
    GetMe(){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/users/me.json',"")
        );
        // return this.http.GetData('/users/me.json',"");
    }

    CreateUser(user:UserCreateModel){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/users.json',JSON.stringify(user))
        );
        // return this.http.PostData('/users.json',JSON.stringify(user));
    }





    AccountModelToCreateAccountModel(input:AccountCreateModel){
        let result = new AccountCreateModel();
       
        if(input){

            result.user_name = input.user_name?input.user_name:null;
            result.display_name = input.display_name?input.display_name:null;
            result.phone = input.phone?input.phone:null;
            result.account_type = input.account_type;
            result.image_base64 = null;
            result.emails = this.typeService.ValidateArray(input.emails)?input.emails:[new ContactModel()];
            result.dates = this.typeService.ValidateArray(input.dates)?input.dates:[new EventDateModel()];
            result.genres = this.typeService.ValidateArray(input.genres)?input.genres:[];
            result.office_hours = this.typeService.ValidateArray(input.office_hours)?input.office_hours:[new WorkingTimeModel()];
            result.operating_hours = this.typeService.ValidateArray(input.operating_hours)?input.operating_hours:[new WorkingTimeModel()];
            result.bio = input.bio?input.bio:null;
            result.about = input.about?input.about:null;
            result.address = input.address?input.address:null;
            result.description = input.description?input.description:null;
            result.fax = input.fax?input.fax:null;
            result.bank_name = input.bank_name?input.bank_name:null;
            result.account_bank_number = input.account_bank_number?input.account_bank_number:null;
            result.account_bank_routing_number = input.account_bank_routing_number?input.account_bank_routing_number:null;
            result.capacity = input.capacity?input.capacity:null;
            result.num_of_bathrooms = input.num_of_bathrooms?input.num_of_bathrooms:null;
            result.min_age = input.min_age?input.min_age:null;
            result.venue_type = input.venue_type?input.venue_type:null;
            result.has_bar = input.has_bar?input.has_bar:null;
            result.located = input.located?input.located:null;
            result.dress_code = input.dress_code?input.dress_code:null;
            result.has_vr = input.has_vr?input.has_vr:null;
            result.audio_description = input.audio_description?input.audio_description:null;
            result.lighting_description = input.lighting_description?input.lighting_description:null;
            result.stage_description = input.stage_description?input.stage_description:null;
            result.lat = input.lat?input.lat:null;
            result.lng = input.lng?input.lng:null;
            result.about = input.about?input.about:null;
            }
            console.log("RES", result);
        return result;
    }

    CreateAccount(acc:AccountCreateModel){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/accounts.json',JSON.stringify(acc))
        );
        // return this.http.PostData('/accounts.json',JSON.stringify(acc));
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
        return this.http.CommonRequest(
            ()=> this.http.PostData('/auth/forgot_password.json',JSON.stringify(params))
        );
        // return this.http.PostData('/auth/forgot_password.json',JSON.stringify(params));
    }



}
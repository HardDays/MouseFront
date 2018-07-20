import { Injectable } from "@angular/core";
import { Http} from '@angular/http';
import { HttpService } from './http.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs';
import {Subject} from 'rxjs/Subject';
import { TypeService } from "./type.service";
import { UserCreateModel } from "../models/userCreate.model";

@Injectable()
export class AdminService{

    // this.typeService.ParamsToUrlSearchParams({})
    constructor(private http: HttpService, private typeService:TypeService){
    }

    Statuses = {
        "just_added": "new",
        "pending": "pending",
        "approved": "approved",
        "denied": "denied",
        "active": "active",
        "inactive": "inactive"
    }

    CreateAdmin(user:UserCreateModel){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin.json',JSON.stringify(user))
        );
    }

    PatchAdmin(user:UserCreateModel,id:number){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/'+id+'.json',JSON.stringify(user))
        );
    }


    //////////////////////////////////////
    //////         ACCOUNTS         //////   
    //////////////////////////////////////

    GetNewAccountsCount()
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/accounts/new_count.json','')
        );
    }

    GetAccountsRequests(params?)
    {
        if(!params){
            params = {
                account_type: 'all',
                limit: 50
            }
        }
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/accounts/requests.json', this.typeService.ParamsToUrlSearchParams(params))
        );
    }

    GetAccountsNew()
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/accounts/new.json', '')
        );
    }

    GetAccountsUserUsage()
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/accounts/user_usage.json', '')
        );
    }

    GetAccountById(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/accounts/'+id+'.json', '')
        );
    }

    AccountApprove(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/accounts/'+id+'/approve.json', JSON.stringify({id}))
        );
    }

    AccountDeny(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/accounts/'+id+'/deny.json', JSON.stringify({id}))
        );
    }

    AccountDelete(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.DeleteDataWithBody('/admin/accounts/'+id+'.json', JSON.stringify({id}))
        );
    }



    //////////////////////////////////////
    //////         EVENTS           //////   
    //////////////////////////////////////


    GetNewEventsCount(params?)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/events/new_count.json', '')
        );
    }

    GetEventsRequests(params?)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/events/requests.json', this.typeService.ParamsToUrlSearchParams(params))
        );
    }

    GetEventById(id)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/events/'+id+'.json', this.typeService.ParamsToUrlSearchParams({id}))
        );
    }

    EventApprove(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/events/'+id+'/approve.json', JSON.stringify({id}))
        );
    }

    EventDeny(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/events/'+id+'/deny.json', JSON.stringify({id}))
        );
    }

    EventDelete(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.DeleteDataWithBody('/admin/events/'+id+'.json', JSON.stringify({id}))
        );
    }



}
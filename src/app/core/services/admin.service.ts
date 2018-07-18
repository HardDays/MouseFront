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

    CreateAdmin(user:UserCreateModel){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/create_admin.json',JSON.stringify(user))
        );
    }

    GetNewAccountsCount()
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/new_accounts_count.json','')
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

    GetEventsRequests(params?)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/events/requests.json', this.typeService.ParamsToUrlSearchParams(params))
        );
    }




}
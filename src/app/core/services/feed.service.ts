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

@Injectable()
export class FeedService{

    constructor(private http: HttpService, private typeService:TypeService){
    }

    GetFeedByAccId(accId:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/accounts/'+accId+'/feed.json',this.typeService.ParamsToUrlSearchParams({account_id:accId}))
        );
    }

    GetActionTypes(){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/feed/action_types.json')
        );
    }

}
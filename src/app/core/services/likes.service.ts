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
import { CommentModel } from "../models/comment.model";

@Injectable()
export class LikesService{

    constructor(private http: HttpService, private typeService:TypeService){
    }

    GetLikesByEventId(eventId:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/events/'+eventId+'/likes.json',this.typeService.ParamsToUrlSearchParams({event_id:eventId}))
        );
    }

    PostLike(event_id:number,account_id:number){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/events/'+event_id+'/likes.json',JSON.stringify({event_id,account_id}))
        );
    }

    DeleteLike(event_id:number,account_id:number){
        return this.http.CommonRequest(
            ()=> this.http.DeleteDataWithBody('/events/'+event_id+'/likes/'+account_id+'.json',JSON.stringify({event_id,account_id}))
        );
    }
}
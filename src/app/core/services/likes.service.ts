import { Injectable } from "@angular/core";
import { Http} from '@angular/http';
import { HttpService } from './http.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';
import { TypeService } from "./type.service";
import { CommentModel } from "../models/comment.model";

@Injectable()
export class LikesService{

    constructor(private http: HttpService, private typeService:TypeService){
    }

    GetCommentByEventId(eventId:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/events/'+eventId+'/likes.json',this.typeService.ParamsToUrlSearchParams({event_id:eventId}))
        );
    }

    PostComment(comment:CommentModel){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/events/'+comment.event_id+'/likes.json',JSON.stringify(comment))
        );
    }

}
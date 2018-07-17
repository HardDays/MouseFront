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
export class CommentService{

    constructor(private http: HttpService, private typeService:TypeService){
    }

    GetCommentByEventId(eventId:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/events/'+eventId+'/comments.json',this.typeService.ParamsToUrlSearchParams({event_id:eventId, limit:20, offset:0}))
        );
    }

    PostComment(comment:CommentModel){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/events/'+comment.event_id+'/comments.json',JSON.stringify(comment))
        );
    }

}
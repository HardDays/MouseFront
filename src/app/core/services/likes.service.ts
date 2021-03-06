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

    GetLikesByFeedId(account_id:number, feed_item_id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/accounts/'+account_id+'/feed/'+feed_item_id+'/likes.json',this.typeService.ParamsToUrlSearchParams({account_id,feed_item_id}))
        );
    }

    PostLike(account_id:number,feed_item_id:number){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/feed_items/'+feed_item_id+'/likes.json',JSON.stringify({feed_item_id,account_id}))
        );
    }

    DeleteLike(account_id:number, feed_item_id:number){
        return this.http.CommonRequest(
            ()=> this.http.DeleteDataWithBody('/feed_items/'+feed_item_id+'/likes.json',JSON.stringify({feed_item_id,account_id}))
        );
    }
}
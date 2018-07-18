import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import { HttpService } from './http.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs';
import {Subject} from 'rxjs/Subject';
import { FeedbackModel } from '../models/feedback.model';


@Injectable()
export class FeedbacksService{
 
    constructor(private http: HttpService){    
    }

    GetFeedback(){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/questions.json','')
        );
    }

    PostFeedback(fb:FeedbackModel){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/questions.json',JSON.stringify(fb))
        );
    }



}
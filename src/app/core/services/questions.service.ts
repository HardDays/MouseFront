import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import { HttpService } from './http.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs';
import {Subject} from 'rxjs/Subject';


@Injectable()
export class QuestionsService{
 
    constructor(private http: HttpService){    
    }

    GetQuestions(){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/questions.json','')
        );
    }

    PostQuestions(subject:string, message:string, account_id:number){
        const params = {
            subject,
            message,
            account_id
        }
        return this.http.CommonRequest(
            ()=> this.http.PostData('/questions.json',JSON.stringify(params))
        );
    }

    ReplyQuestion(id:number, subject:string, message:string, account_id:number){
        const params = {
            subject,
            message,
            account_id,
            id
        }
        return this.http.CommonRequest(
            ()=> this.http.PostData('/questions/'+id+'/reply.json',JSON.stringify(params))
        );
    }



}
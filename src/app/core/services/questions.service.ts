import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import { HttpService } from './http.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';
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

    PostQuestions(subject:string, message:string){
        const params = {
            subject,
            message
        }
        return this.http.CommonRequest(
            ()=> this.http.PostData('/questions.json',JSON.stringify(params))
        );
    }



}
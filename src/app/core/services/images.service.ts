import { Injectable } from "@angular/core";
import { Http} from '@angular/http';
import { HttpService } from './http.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';


@Injectable()
export class ImagesService{

    
    constructor(private http: HttpService){
     
    }

    GetImageById(id:number, imageId:number){
        return this.http.CommonRequestWithBody(
            ()=> this.http.GetData('/images/'+imageId,"")
        );
        // return this.http.GetData('/images/'+imageId,"");
    }



}
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


@Injectable()
export class ImagesService{

    
    constructor(private http: HttpService, private typeService:TypeService){
     
    }

    GetImageById(imageId:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/images/'+imageId,"")
        );
        // return this.http.GetData('/images/'+imageId,"");
    }


    PostAccountImage(accountId:number,object:any)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/accounts/'+accountId+'/images.json',object)
        );
        // return this.http.GetData('/images/'+imageId,"");
    }

    GetAccountImages(accountId:number,params?:any)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/accounts/'+accountId+'/images.json',this.typeService.ParamsToUrlSearchParams(params))
        );
    }



}
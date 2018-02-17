import { Injectable } from "@angular/core";
import {Http} from "@angular/http";
import {Response, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { TokenModel } from '../models/token.model';
import { empty } from "rxjs/observable/empty";

@Injectable()
export class HttpService
{

    serverUrl: string = "https://mouse-back.herokuapp.com";
    public headers:Headers = new Headers([]);
    public token: TokenModel = new TokenModel('');
    constructor(private http: Http){
        if(!this.headers.has('Content-Type'))
            this.headers.append('Content-Type','application/json');
    }

    BaseInitByToken(data:string)
    {
        if(data){
            if(this.headers.has('Authorization'))
                this.headers.delete('Authorization');
            this.headers.append('Authorization',data);
            this.token = new TokenModel(data);
        }
    }
    

    GetToken():TokenModel{
        return this.token;
    }

    validResp(resp){
        // console.log(`resp`,resp);
        let body = resp._body;
        // console.log(`body = `,body);
        if(body==" ")return false;
        return true;
    }

    PostData(method:string,data:string)
    {
        if(!this.headers.has('Content-Type'))
            this.headers.append('Content-Type','application/json');
        return this.http.post(this.serverUrl + method,data, {headers:this.headers})
            .map((resp:Response)=>this.validResp(resp)?resp.json():"")
            .catch((error:any) =>{return Observable.throw(error);});
    }

    PatchData(method:string,data:any)
    {
        if(!this.headers.has('Content-Type'))
            this.headers.append('Content-Type','application/json');

        return this.http.patch(this.serverUrl + method,data, {headers:this.headers})
            .map((resp:Response)=>resp.json())
            .catch((error:any) =>{return Observable.throw(error);});
    }

    GetData(method:string,params:string)
    {
        if(!this.headers.has('Content-Type'))
            this.headers.append('Content-Type','application/json');
        return this.http.get(this.serverUrl + method + "?"+ params,{headers:this.headers})
            .map((resp:Response)=>this.validResp(resp)?resp.json():"")
            .catch((error:any) =>{return Observable.throw(error);});
    }

    PutData(method:string,data:string){
        if(!this.headers.has('Content-Type'))
            this.headers.append('Content-Type','application/json');
        return this.http.put(this.serverUrl + method,data,{headers:this.headers})
            .map((resp:Response)=>this.validResp(resp)?resp.json():"")
            .catch((error:any) =>{return Observable.throw(error);});
    }
    DeleteData(method:string){
        if(!this.headers.has('Content-Type'))
            this.headers.append('Content-Type','application/json');
        return this.http.delete(this.serverUrl + method,{headers:this.headers})
            .map((resp:Response)=>this.validResp(resp)?resp.json():"")
            .catch((error:any) =>{return Observable.throw(error);});
    }



}
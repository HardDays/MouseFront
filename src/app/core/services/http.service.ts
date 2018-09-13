import { Injectable } from "@angular/core";
import {Http, RequestOptions} from "@angular/http";
import {Response, Headers, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { TokenModel } from '../models/token.model';
import { empty } from "rxjs/observable/empty";
declare var Buffer: any;
@Injectable()
export class HttpService
{
    serverUrl: string = "https://mouse-back.herokuapp.com";
    // serverUrl: string = "https://protected-island-7029.herokuapp.com";

    public headers:Headers = new Headers([]);
    public token: TokenModel = new TokenModel('');
    constructor(private http: Http){
        this.BaseHeadersInit();
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

    BaseHeadersInit()
    {
        if(!this.headers.has('Content-Type'))
            this.headers.append('Content-Type','application/json');
    }


    GetToken():TokenModel{
        return this.token;
    }

    validResp(resp){
        let body = resp._body;
        if(body==" ")return false;
        return true;
    }

    CommonRequest(fun:()=>Observable<Response>)
    {
        this.BaseHeadersInit();

        return fun()
            .map(
                (resp:Response)=>this.validResp(resp)?resp.json():""
            )
            .catch(
                (error:any) =>{
                        return Observable.throw(error);
                    }
            );
    }

    GetQueryStr(method:string, params?:string)
    {
        return this.serverUrl + method + "?" + params;
    }

    GetData(method:string,params?:string)
    {
        return this.http.get(this.serverUrl + method + "?"+ params,{headers:this.headers})
    }

    DeleteData(method:string)
    {
        return this.http.delete(this.serverUrl + method,{headers:this.headers})
    }
    DeleteDataWithBody(method:string,body:any)
    {
        return this.http.delete(this.serverUrl + method, new RequestOptions({
            headers:this.headers,
            body: body
          }))
    }

    DeleteDataWithParam(method:string,param)
    {
        return this.http.delete(this.serverUrl + method + "?"+ param,{headers:this.headers})
    }

    PostData(method:string,data:any)
    {
        return this.http.post(this.serverUrl + method,data, {headers:this.headers});
    }

    PatchData(method:string,data:any)
    {
        return this.http.patch(this.serverUrl + method,data, {headers:this.headers});
    }

    PutData(method:string,data:string)
    {
        return this.http.put(this.serverUrl + method,data,{headers:this.headers});
    }

    GetDataFromOtherUrl(url:string){
        return this.http.get(url,{headers:this.headers})
    }

    // Twitter(){
    // var header = 'NyrgI10oqxoONmcXukFfpLFuN' + ':' +'FUsXhlpmh62zHlnlrxGX1pnMOIrg2JNdrSU5XKqLnjATE6fC2q';
    // var encheader = new Buffer(header).toString('base64');
    // var finalheader = 'Basic ' + encheader;
    // //console.log(finalheader);
    // var headers = new Headers();

    // headers.append('Content-Type','application/json');
    // // headers.append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // // headers.append("Access-Control-Allow-Origin", "*");
    // // // headers.append('Access-Control-Allow-Origin', '*');
    // // // headers.append('Content-Type', 'application/X-www-form-urlencoded');
    // // headers.append('Access-Control-Allow-Origin', 'https://api.twitter.com/oauth2/token');
    // // headers.append('Access-Control-Allow-Credentials', 'true');
    // headers.append('Authorization',finalheader);
    // return this.http.post('https://api.twitter.com/oauth2/token',{'grant_type': 'client_credentials'},{
    //                     headers: headers});
    // }
}

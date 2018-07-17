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


@Injectable()
export class PhoneService{

    
    constructor(private http: HttpService, private typeService:TypeService){
     
    }

    GetAllPhoneCodes(){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/phone_validations/codes.json','')
        );
    }

    SendCodeToPhone(phone:string){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/phone_validations.json',JSON.stringify({phone:phone}))
        );
    }
    
    ReSendCodeToPhone(phone:string){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/phone_validations/resend.json',JSON.stringify({phone:phone}))
        );
    }

    SendRequestCode(phone:string,code:string){
        let params={
            phone: phone,
            code: code
        }
        return this.http.CommonRequest(
            ()=> this.http.PatchData('/phone_validations.json',JSON.stringify(params))
        );
    }



}
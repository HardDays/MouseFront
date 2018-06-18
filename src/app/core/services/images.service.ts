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
import { VenueMediaPhotoModel } from '../models/venueMediaPhoto.model';


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


    PostAccountImage(accountId:number,object?: VenueMediaPhotoModel)
    {
        // let params = {
        //     image_base64:image,
        //     description:info?info:''
        // };
        return this.http.CommonRequest(
            ()=> this.http.PostData('/accounts/'+accountId+'/images.json',JSON.stringify(object))
        );
        // return this.http.GetData('/images/'+imageId,"");
    }

    GetAccountImages(accountId:number,params?:any)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/accounts/'+accountId+'/images.json',this.typeService.ParamsToUrlSearchParams(params))
        );
    }

    DeleteImageById(imageId:number,accountId:number){
        let params = {
            id: imageId,
            account_id: accountId
        };
        
        return this.http.CommonRequest(
            ()=> this.http.DeleteDataWithBody('/images/'+imageId,JSON.stringify(params))
        );
    }


    GetImageSize(Id:number){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/images/'+Id+'/size.json', '')
        );
        //return this.http.GetData('/accounts/my.json', this.typeService.ParamsToUrlSearchParams(params));
    }

    GetImagePreview(Id:number, params:any)
    {
        return this.http.GetQueryStr('/images/'+Id+'/preview.json',this.typeService.ParamsToUrlSearchParams(params));
        // return this.http.CommonRequest(
        //     ()=> this.http.GetData('/images/'+Id+'/preview.json',this.typeService.ParamsToUrlSearchParams(params))
        // );
    }

}
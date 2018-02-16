import { Injectable } from "@angular/core";
import { Http, URLSearchParams } from '@angular/http';
import { HttpService } from './http.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';


@Injectable()
export class ImagesService{

    
    constructor(private http: HttpService, private router: Router){
     
    }

    GetImageById(id:number, imageId:number){
        return this.http.GetData('/images/'+imageId,"");
    }



}
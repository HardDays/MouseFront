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
import {TokenModel} from "./../models/token.model";
import { SelectModel } from './../models/select.model';
import { FrontWorkingTimeModel } from './../models/frontWorkingTime.model';

@Injectable()
export class TypeService{

    constructor(private http: HttpService, private router: Router){     
    }

    GetAllVenueTypes()
    {
        return [
            new SelectModel("Night club",1),
            new SelectModel("Concert hall",2),
            new SelectModel("Event space",3),
            new SelectModel("Theatre",4),
            new SelectModel("Additional room",5),
            new SelectModel("Stadium arena",6),
            new SelectModel("Outdoor space",7),
            new SelectModel("Private residence",8),
            new SelectModel("Other",9)
        ];
    }

    GetAllAccountTypes()
    {
        return [
            new SelectModel("Fan", "fan"),
            new SelectModel("Artist", "artist"),
            new SelectModel("Venue", "venue")
        ];
    }
   
    GetAllLocationTypes()
    {
        return [
            new SelectModel("Indoors", "indoors"),
            new SelectModel("Outdoors", "outdoors"),
            new SelectModel("Other location", "other_location")
        ];
    }

    GetAllBookingNotices()
    {
        return [
            new SelectModel("Same day", "same_day"),
            new SelectModel("One day", "one_day"),
            new SelectModel("Two seven days", "two_seven_days")
        ];
    }

    public GetAllDays(){
        return [
            new FrontWorkingTimeModel('monday'),
            new FrontWorkingTimeModel('tuesday'),
            new FrontWorkingTimeModel('wednesday'),
            new FrontWorkingTimeModel('thursday'),
            new FrontWorkingTimeModel('friday'),
            new FrontWorkingTimeModel('saturday'),
            new FrontWorkingTimeModel('sunday')
        ];
    }

    public ValidateArray(array:any[])
    {
        return (array.length > 0 && array[0] != null)?array:null;
    }
    
    ParamsToUrlSearchParams(params:any):string{
        let options = new URLSearchParams();

        for(let key in params){
            let prop:any = params[key];
            if(prop){
                if( prop instanceof Array){
                    for(let i in prop){
                        if(prop[i])
                            options.append(key+"[]",prop[i]);
                    }
                }
                else
                    options.set(key,params[key]);
            }
        }
        return options.toString();
    }



}



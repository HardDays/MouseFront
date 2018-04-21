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
import { TicketTypeModel } from '../models/ticketType.model';

@Injectable()
export class TypeService{

    constructor(private http: HttpService, private router: Router){     
    }

    GetAllSpaceTypes()
    {
        return [
            new SelectModel("Night club", "night_club"),
            new SelectModel("Concert hall", "concert_hall"),
            new SelectModel("Event space", "event_space"),
            new SelectModel("Theatre", "theatre"),
            new SelectModel("Additional room", "additional_room"),
            new SelectModel("Stadium arena", "stadium_arena"),
            new SelectModel("Outdoor space", "outdoor_space"),
            new SelectModel("Other", "other")
        ];
    }

    GetAllLocatedTypes()
    {
        return [
            new SelectModel("Indoors", "indoors"),
            new SelectModel("Outdoors", "outdoors"),
            new SelectModel("Both", "other_location")
        ];
    }

    GetAllVenueTypes()
    {
        return [
            new SelectModel("Public venue", "public_venue"),
            new SelectModel("Private residence", "private_residence")
        ];
    }

    GetAllTicketTypes()
    {
        return [
            new TicketTypeModel("In person", "in_person", false),
            new TicketTypeModel("VIP", "vip", false)
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
            new FrontWorkingTimeModel('monday', null, null, false),
            new FrontWorkingTimeModel('tuesday', null, null, false),
            new FrontWorkingTimeModel('wednesday', null, null, false),
            new FrontWorkingTimeModel('thursday', null, null, false),
            new FrontWorkingTimeModel('friday', null, null, false),
            new FrontWorkingTimeModel('saturday', null, null, false),
            new FrontWorkingTimeModel('sunday', null, null, false)
        ];
    }

    public GetTime()
    {
        let result:string[] = [];
        let time = 0;

        while( time < 12*60)
        {
            result.push(((time/60) < 10? "0":"" + (time/60)) +":"+((time%60) < 10? "0":"" + (time%60)));
            time = time + 30;
        }
        return result;
    }

    public ValidateArray(array:any[])
    {
        if(array) {
            let result:any[] = [];
            let objValid = true;
            for(let obj of array)
            {
                if(obj){
                    for(let key in obj)
                    {
                        if(!obj[key])
                            objValid = false;
                    }

                    if(objValid)
                        result.push(obj);

                    objValid = true;
                }
            }
            return result.length > 0 ? result : null;
            
        }
        return null;
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

    StringJSON(params) {
        let options = "";
        options += "{";
        for(let key in params){
            let prop:any = params[key];
            if(prop){
                if( prop instanceof Array){
                    for(let i in prop){
                        if(prop[i]){
                            options += '"' + key + '"' + ':' + '["' + prop[i] + '"]' + ',';
                        }
                    }
                }
                else{
                    options += '"' + key + '":' + '"' + params[key] + '"' + ','; 
                }
            }
        }
        options = options.slice(0, options.length - 1);
        options += "}";
        return options;
    }



}



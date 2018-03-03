import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Router } from "@angular/router";
import { AccountGetModel } from "../models/accountGet.model";
import { AccountCreateModel } from "../models/accountCreate.model";
import { Subject } from "rxjs";
import { FrontWorkingTimeModel } from "../models/frontWorkingTime.model";
import { WorkingTimeModel } from '../models/workingTime.model';
import { EventDateModel } from "../models/eventDate.model";
import { ContactModel } from "../models/contact.model";
import { TypeService } from './type.service';
import { Base64ImageModel } from '../models/base64image.model';
import { GengreModel } from '../models/genres.model';

@Injectable()
export class AccountService{
    public onAuthChange$: Subject<boolean>;
    public onLoadingChange$: Subject<boolean>;
    //public pushNotif:NotificationsComponent = new NotificationsComponent();
    constructor(private http: HttpService, private router: Router, private typeService: TypeService){
        this.onAuthChange$ = new Subject();
        this.onAuthChange$.next(false);
        this.onLoadingChange$ = new Subject();
        this.onLoadingChange$.next(false);
    }

    AccountModelToCreateAccountModel(input:AccountGetModel){
        let result = new AccountCreateModel();
       
        if(input){

            result.user_name = input.user_name?input.user_name:null;
            result.display_name = input.display_name?input.display_name:null;
            result.phone = input.phone?input.phone:null;
            result.account_type = input.account_type;
            result.image_base64 = null;
            result.emails = this.typeService.ValidateArray(input.emails)?input.emails:[new ContactModel()];
            result.dates = input.dates;
            console.log("BEFORE", input.genres);
            result.genres = input.genres?input.genres:null;
            console.log("AFTER", result.genres);
            result.office_hours = this.typeService.ValidateArray(input.office_hours)?input.office_hours:[new WorkingTimeModel()];
            result.operating_hours = this.typeService.ValidateArray(input.operating_hours)?input.operating_hours:[new WorkingTimeModel()];
            result.bio = input.bio?input.bio:null;
            result.about = input.about?input.about:null;
            result.address = input.address?input.address:null;
            result.description = input.description?input.description:null;
            result.fax = input.fax?input.fax:null;
            result.bank_name = input.bank_name?input.bank_name:null;
            result.account_bank_number = input.account_bank_number?input.account_bank_number:null;
            result.account_bank_routing_number = input.account_bank_routing_number?input.account_bank_routing_number:null;
            result.capacity = input.capacity?input.capacity:null;
            result.num_of_bathrooms = input.num_of_bathrooms?input.num_of_bathrooms:null;
            result.min_age = input.min_age?input.min_age:null;
            result.venue_type = input.venue_type?input.venue_type:null;
            result.has_bar = input.has_bar?input.has_bar:null;
            result.located = input.located?input.located:null;
            result.dress_code = input.dress_code?input.dress_code:null;
            result.has_vr = input.has_vr?input.has_vr:null;
            result.audio_description = input.audio_description?input.audio_description:null;
            result.lighting_description = input.lighting_description?input.lighting_description:null;
            result.stage_description = input.stage_description?input.stage_description:null;
            result.lat = input.lat?input.lat:null;
            result.lng = input.lng?input.lng:null;
            result.about = input.about?input.about:null;
            }
            console.log("RES", result);
        return result;
    }

    MyOwnJSON(params: AccountCreateModel) {
        let options = new String();
        options += "{";
        for(let key in params){
            let prop:any = params[key];
            if(prop){
                if( prop instanceof Array){
                    for(let i in prop){
                        if(prop[i]){
                            options += '"' + key + '"' + ':' + '"' + JSON.stringify(prop[i]) + '"' + ',';
                        }
                    }
                    
                }
                else{
                    options += '"' + key + '":' + '"' + params[key] + '"' + ','; 
                }
            }
        }
        options = options.slice(0, options.length - 1 );
        options += "}";
        return options;
    // if(input){
    //     let result = {
    //     "user_name": input.user_name,	
    //     "display_name": input.display_name,
    //     "phone": input.phone,	
    //     "account_type": input.account_type,
    //     "image": input.image,
    //     "bio": input.bio,
    //     "address": input.address,
    //     "description": input.description,
    //     "fax": input.fax,
    //     "bank_name": input.bank_name,
    //     "account_bank_number": input.account_bank_number,
    //     "account_bank_routing_number": input.account_bank_routing_number,
    //     "capacity": input.capacity,
    //     "num_of_bathrooms": input.num_of_bathrooms,
    //     "min_age": input.min_age,
    //     "venue_type": input.venue_type,
    //     "has_bar": input.has_bar,
    //     "located": input.located,
    //     "dress_code": input.dress_code,
    //     "has_vr": input.has_vr,
    //     "audio_description": input.audio_description,
    //     "lighting_description": input.lighting_description,
    //     "stage_description": input.stage_description,
    //     "lat": input.lat,
    //     "lng": input.lng,
    //     "dates": input.dates, 
    //     "emails": input.emails,
    //     "office_hours": input.office_hours,
    //     "operating_hours": input.operating_hours,
    //     "about": input.about
    //     }
    // return result;
    
    }

    GetMyAccount(params?:any){
        return this.http.GetData('/accounts/my.json', this.typeService.ParamsToUrlSearchParams(params));
    }

    UpdateMyAccount(id:number, data: any){
        return this.http.PatchData('/accounts/' + id + ".json",data);
    }

    CreateAccount(data:any)
    {
        return this.http.PostData("/accounts.json", data);
    }

    FollowAccountById(me:number,target:number)
    {
        return this.http.PostData("/accounts/" + me + "/follow.json",JSON.stringify({"follower_id":target}));
    }

    DeleteMe(id:number){
        return this.http.DeleteData('/accounts/' + id);
    }

    public GetWorkingTimeFromFront(days:FrontWorkingTimeModel[]):WorkingTimeModel[]{
        let result:WorkingTimeModel[] = [];

        for(let i of days){
            if(i.checked)
                result.push(new WorkingTimeModel(i.start_work, i.finish_work, i.name));
        }
        return (result.length > 0 && result[0])?result:null;
    }

    public GetFrontWorkingTimeFromTimeModel(days:WorkingTimeModel[]):FrontWorkingTimeModel[]{
        let result:FrontWorkingTimeModel[] = [];
        let frontDays:FrontWorkingTimeModel[];
        frontDays = this.typeService.GetAllDays();
        for(let i of days)
        {
            for(let j in frontDays){
                if(frontDays[j].name == i.day){
                    frontDays[j] = new FrontWorkingTimeModel(frontDays[j].name,this.GetTimeFromString(i.begin_time),
                    this.GetTimeFromString(i.end_time),true);
                }
            }
        }
        return frontDays;
    }


    public ParseWorkingTimeModelArr(days:WorkingTimeModel[]):WorkingTimeModel[]
    {
        let result:WorkingTimeModel[] = [];
        for(let i of days)
        {
            result.push(
                new WorkingTimeModel(
                    this.GetTimeFromString(i.begin_time),
                    this.GetTimeFromString(i.end_time),
                    i.day[0].toUpperCase() + i.day.substr(1,2)
                )
            );
        }
        return result;
    }

    GetTimeFromString(str:string)
    {
        if(!str)
            return null;
        let split = str.split("T");
        return split && split[1]?split[1].substring(0,5):null;
    }

    AccountFollow(id:number,follower_id:number){
    let params={
        // id:id,
        follower_id:follower_id
    }
    return this.http.PostData('/accounts/+'+id+'/follow.json',JSON.stringify(params));
    }
}
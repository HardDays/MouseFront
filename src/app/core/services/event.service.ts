import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpService } from "./http.service";
import { Router } from "@angular/router";
import { TypeService } from "./type.service";
import { AccountCreateModel } from "../models/accountCreate.model";
import { EventCreateModel } from "../models/eventCreate.model";
import { ArtistAddToEventModel } from "../models/artistAddToEvent.model";

@Injectable()
export class EventService{
    public onAuthChange$: Subject<boolean>;
    public onLoadingChange$: Subject<boolean>;
    //public pushNotif:NotificationsComponent = new NotificationsComponent();
    constructor(private http: HttpService, private router: Router, private typeService: TypeService){
        this.onAuthChange$ = new Subject();
        this.onAuthChange$.next(false);
        this.onLoadingChange$ = new Subject();
        this.onLoadingChange$.next(false);
    }

    GetAllEvents(){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/events.json',"")
        );
    }
    
    CreateEvent(params:EventCreateModel){
        return this.http.CommonRequest(
            () => this.http.PostData('/events.json',JSON.stringify(params))
        );
    }
    GetEventById(id:number){
        return this.http.CommonRequest(
            () => this.http.GetData('/events/'+id+'.json',this.typeService.ParamsToUrlSearchParams({'id':id}))
        );
    }

    AddArtist(artist:ArtistAddToEventModel){
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+artist.id+'/artist.json',JSON.stringify(artist))
        );
    }

}
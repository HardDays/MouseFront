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
    EventsSearch(params){
        return this.http.CommonRequest(
            () => this.http.GetData('/events/search.json',JSON.stringify(params))
        );
    }
    AddArtist(event:ArtistAddToEventModel){
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+event.event_id+'/artists.json',JSON.stringify(event))
        );
    }
    ArtistAccept(event:ArtistAddToEventModel){
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+event.event_id+'/artists/'+event.artist_id+'/accept.json',JSON.stringify(event))
        );
    }
    ArtistDecline(event:ArtistAddToEventModel){
        return this.http.CommonRequest(
            () =>this.http.PostData('/events/'+event.event_id+'/artists/'+event.artist_id+'/decline.json',JSON.stringify(event))
        );
    }

}
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpService } from "./http.service";
import { Router } from "@angular/router";
import { TypeService } from "./type.service";
import { AccountCreateModel } from "../models/accountCreate.model";
import { EventCreateModel } from "../models/eventCreate.model";
import { AccountAddToEventModel } from "../models/artistAddToEvent.model";
import { EventPatchModel } from "../models/eventPatch.model";
import { EventGetModel } from "../models/eventGet.model";
import { TicketGetParamsModel } from "../models/ticketGetParams.model";
import { TicketModel } from "../models/ticket.model";

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
    GetMyEvents(id:number){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/events/my.json',this.typeService.ParamsToUrlSearchParams({'account_id':id}))
        );
    }
    
    CreateEvent(params:EventCreateModel){
        return this.http.CommonRequest(
            () => this.http.PostData('/events.json',JSON.stringify(params))
        );
    }
    UpdateEvent(params:EventCreateModel,id:number){
        var patchModel:EventPatchModel = new EventPatchModel();
        patchModel.id = id;
        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                patchModel[key] = params[key];
            }
        }
        return this.http.CommonRequest(
            () => this.http.PatchData('/events/'+patchModel.id+'.json',JSON.stringify(patchModel))
        );
    }
    GetEventById(id:number){
        return this.http.CommonRequest(
            () => this.http.GetData('/events/'+id+'.json',this.typeService.ParamsToUrlSearchParams({'id':id}))
        );
    }
    EventsSearch(params){
        return this.http.CommonRequest(
            () => this.http.GetData('/events/search.json',this.typeService.ParamsToUrlSearchParams(params))
        );
    }
    AddArtist(event:AccountAddToEventModel){
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+event.event_id+'/artists.json',JSON.stringify(event))
        );
    }
    ArtistAcceptOwner(params){
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+params.event_id+'/artists/'+params.id+'/owner_accept.json',JSON.stringify(params))
        );
    }
    ArtistDeclineOwner(params){
        return this.http.CommonRequest(
            () =>this.http.PostData('/events/'+params.event_id+'/artists/'+params.id+'/owner_decline.json',JSON.stringify(params))
        );
    }

    AddVenue(event:AccountAddToEventModel){
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+event.event_id+'/venue.json',JSON.stringify(event))
        );
    }
    VenueAcceptOwner(event:AccountAddToEventModel){
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+event.event_id+'/venue/'+event.venue_id+'/owner_accept.json',JSON.stringify(event))
        );
    }
    VenueDeclineOwner(event:AccountAddToEventModel){
        return this.http.CommonRequest(
            () =>this.http.PostData('/events/'+event.event_id+'/venue/'+event.venue_id+'/owner_decline.json',JSON.stringify(event))
        );
    }

    GetTickets(params:TicketGetParamsModel){
        return this.http.CommonRequest(
            () => this.http.GetData('/events/'+params.event_id+'/tickets/'+params.id+'.json',this.typeService.ParamsToUrlSearchParams(params))
        );
    }
    AddTicket(ticket:TicketModel){
        return this.http.CommonRequest(
            () =>this.http.PostData('/events/'+ticket.event_id+'/tickets.json',JSON.stringify(ticket))
        );
    }
    UpdateTicket(ticket:TicketModel){
        return this.http.CommonRequest(
            () =>this.http.PatchData('/events/'+ticket.event_id+'/tickets/'+ticket.id+'.json',JSON.stringify(ticket))
        );
    }

}
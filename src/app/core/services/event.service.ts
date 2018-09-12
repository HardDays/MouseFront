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
import { AccountSendRequestModel } from "../models/accountSendRequest.model";
import { identifierModuleUrl } from "@angular/compiler";
import { PurchaseModel } from "../models/purchase.model";

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

    UpdateEvent(id:number,params:EventCreateModel){
        return this.http.CommonRequest(
            () => this.http.PatchData('/events/'+id+'.json',params)
        );
    }
    GetEventById(id:number){
        return this.http.CommonRequest(
            () => this.http.GetData('/events/'+id+'.json', '')
        );
    }
    EventsSearch(params){
        return this.http.CommonRequest(
            () => this.http.GetData('/events/search.json',this.typeService.ParamsToUrlSearchParams(params))
        );
    }
    EventsUpdates(id:number){
        return this.http.CommonRequest(
            () => this.http.GetData('/events/'+id+'/updates.json')
        );
    }
    EventGoingAcc(eventId:number,limit:number,offset:number,text?:string){
        return this.http.CommonRequest(
            () => this.http.GetData('/events/'+eventId+'/backers.json',this.typeService.ParamsToUrlSearchParams({limit,offset,text}))
        );
    }
    EventsMy(params){
        return this.http.CommonRequest(
            () => this.http.GetData('/events/my.json',this.typeService.ParamsToUrlSearchParams(params))
        );
    }
    GetEvents(id){
        return this.http.CommonRequest(
            () => this.http.GetData('/accounts/'+id+'/events.json','')
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
    VenueAcceptOwner(params){
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+params.event_id+'/venue/'+params.id+'/owner_accept.json',JSON.stringify(params))
        );
    }
    VenueDeclineOwner(params){
        return this.http.CommonRequest(
            () =>this.http.PostData('/events/'+params.event_id+'/venue/'+params.id+'/owner_decline.json',JSON.stringify(params))
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

    ArtistSetActive(params){
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+params.event_id+'/artists/'+params.id+'/set_active.json',JSON.stringify(params))
        );
    }
    ArtistRemoveActive(params){
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+params.event_id+'/artists/'+params.id+'/remove_active.json',JSON.stringify(params))
        );
    }

    VenueSetActive(params){
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+params.event_id+'/venue/'+params.id+'/set_active.json',JSON.stringify(params))
        );
    }
    VenueRemoveActive(params){
         return this.http.CommonRequest(
            () => this.http.PostData('/events/'+params.event_id+'/venue/'+params.id+'/remove_active.json',JSON.stringify(params))
        );
    }

    ArtistAcceptedByArtist(params:AccountSendRequestModel){
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+params.event_id+'/artists/'+params.id+'/artist_accept.json',JSON.stringify(params))
        );
    }
    ArtistDeclineByArtist(params:AccountSendRequestModel){
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+params.event_id+'/artists/'+params.id+'/artist_decline.json',JSON.stringify(params))
        );
    }

    VenueAcceptedByVenue(params:AccountSendRequestModel){
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+params.event_id+'/venue/'+params.id+'/venue_accept.json',JSON.stringify(params))
        );
    }
    VenueDeclineByVenue(params:AccountSendRequestModel){
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+params.event_id+'/venue/'+params.id+'/venue_decline.json',JSON.stringify(params))
        );
    }

    ArtistSendRequest(event:AccountAddToEventModel){
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+event.event_id+'/artists/'+event.id+'/send_request.json',JSON.stringify(event))
        );
    }

    VenueSendRequest(event:AccountAddToEventModel){
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+event.event_id+'/venue/'+event.id+'/send_request.json',JSON.stringify(event))
        );
    }

    SetLaunch(id:number,account_id:number){

        let params = {
            id:id,
            account_id:account_id
        }
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+id+'/launch.json',JSON.stringify(params))
        );
    }

    SetVerify(id:number,account_id:number){

        let params = {
            id:id,
            account_id:account_id
        }
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+id+'/verify.json',JSON.stringify(params))
        );
    }
    
    SetDeActive(id:number,account_id:number){

        let params = {
            id:id,
            account_id:account_id
        }
        return this.http.CommonRequest(
            () => this.http.PostData('/events/'+id+'/deactivate.json',JSON.stringify(params))
        );
    }

    GetAnalytics(id:number){
        return this.http.CommonRequest(
            ()=> this.http.GetData('/events/'+id+'/analytics.json', this.typeService.ParamsToUrlSearchParams({id}))
        );
    }


    /*тикеты*/
    GetAllTicketsCurrent(myId,CurrOrPass){
        let params = {
            account_id: myId,
            time:CurrOrPass
        }
        return this.http.CommonRequest(
            ()=> this.http.GetData('/fan_tickets.json', this.typeService.ParamsToUrlSearchParams(params))
        );
    }
    GetAllTicketswithoutCurrent(myId){
        let params = {
            account_id: myId
        }
        return this.http.CommonRequest(
            ()=> this.http.GetData('/fan_tickets.json', this.typeService.ParamsToUrlSearchParams(params))
        );
    }
    MyTicketsSearch(params){
        return this.http.CommonRequest(
            () => this.http.GetData('/fan_tickets/search.json',this.typeService.ParamsToUrlSearchParams(params))
        );
    }

    GetTicketsByEvent(myId,eventId){
        let params = {
            account_id: myId,
            event_id:eventId
        }
        return this.http.CommonRequest(
            ()=> this.http.GetData('/fan_tickets/by_event.json', this.typeService.ParamsToUrlSearchParams(params))
        );
    }

    GetTicketInfoById(ticketId:number, accountId:number)
    {
        let params = {account_id:accountId};

        return this.http.CommonRequest(
            () => this.http.GetData('/fan_tickets/'+ticketId,this.typeService.ParamsToUrlSearchParams(params))
        );
    }

    BuyTicket(params:any)
    {
        return this.http.CommonRequest(
            () => this.http.PostData('/fan_tickets',params)
        );
    }

    BuyTicketPack(params:any)
    {
        return this.http.CommonRequest(
            () => this.http.PostData('/fan_tickets/many.json',params)
        );
    }

    StartPurchaseTickets(params:PurchaseModel)
    {
        return this.http.CommonRequest(
            () => this.http.PostData('/fan_tickets/start_purchase.json', params)
        );
    }

    FinishPayPal(params:any)
    {
        return this.http.CommonRequest(
            () => this.http.GetData('/fan_tickets/finish_paypal.json', this.typeService.ParamsToUrlSearchParams(params))
        );
    }

    public EventModelToCreateEventModel(input:EventGetModel){
        let result = new EventCreateModel();
             for (let key in input) {
                        if (input.hasOwnProperty(key)) {
                            result[key] = input[key];
                        }
                    }
        return result;
    }

    GetEventAnalytics(id:number)
    {
        return this.http.CommonRequest(
            () => this.http.GetData("/events/" + id + "/analytics.json")
        );
    }



}
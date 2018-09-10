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
import { UserCreateModel } from "../models/userCreate.model";

@Injectable()
export class AdminService{

    public NewCountChange:Subject<boolean>;
    // this.typeService.ParamsToUrlSearchParams({})
    constructor(private http: HttpService, private typeService:TypeService){
        this.NewCountChange = new Subject();
        this.NewCountChange.next(true);
    }



    Statuses = {
        "just_added": "new",
        "pending": "pending",
        "approved": "approved",
        "denied": "denied",
        "active": "active",
        "inactive": "inactive"
    }

    GetMyAccByIdUser(id:number){

        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/'+id+'/my.json','')
        );
    }

    CreateAdmin(user:UserCreateModel){
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin.json',JSON.stringify(user))
        );
    }

    PatchAdmin(user:UserCreateModel,id:number){
        return this.http.CommonRequest(
            ()=> this.http.PatchData('/admin/'+id+'.json',JSON.stringify(user))
        );
    }


    //////////////////////////////////////
    //////         ACCOUNTS         //////
    //////////////////////////////////////

    GetNewAccountsCount()
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/accounts/new_count.json','')
        );
    }

    GetAccountsRequests(params?)
    {
        if(!params){
            params = {
                account_type: 'all'
            }
        }
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/accounts/requests.json', this.typeService.ParamsToUrlSearchParams(params))
        );
    }

    GetAccountsNew()
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/accounts/new.json', '')
        );
    }

    GetAccountsUserUsage()
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/accounts/user_usage.json', '')
        );
    }

    GetAccountById(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/accounts/'+id+'.json', '')
        );
    }

    AccountApprove(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/accounts/'+id+'/approve.json', JSON.stringify({id}))
        );
    }

    AccountDeny(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/accounts/'+id+'/deny.json', JSON.stringify({id}))
        );
    }

    AccountDelete(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.DeleteDataWithBody('/admin/accounts/'+id+'.json', JSON.stringify({id}))
        );
    }

    GetAccountFunding()
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/accounts/funding.json', this.typeService.ParamsToUrlSearchParams({account_type:'all'}))
        );
    }

    GetAccountsGraph(by?:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/accounts/graph.json', this.typeService.ParamsToUrlSearchParams({by}))
        );
    }

    AccountView(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/accounts/'+id+'/view.json', JSON.stringify({id}))
        );
    }

    GetInvites(limit:number,offset:number,invite_type = 'all')
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/invites.json', this.typeService.ParamsToUrlSearchParams({limit,offset,invite_type}))
        );
    }



    //////////////////////////////////////
    //////         EVENTS           //////
    //////////////////////////////////////


    GetNewEventsCount(params?)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/events/new_count.json', '')
        );
    }



    GetEventsRequests(params?)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/events/requests.json', this.typeService.ParamsToUrlSearchParams(params))
        );
    }

    GetEventById(id)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/events/'+id+'.json', this.typeService.ParamsToUrlSearchParams({id}))
        );
    }

    EventApprove(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/events/'+id+'/approve.json', JSON.stringify({id}))
        );
    }

    EventDeny(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/events/'+id+'/deny.json', JSON.stringify({id}))
        );
    }

    EventDelete(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.DeleteDataWithBody('/admin/events/'+id+'.json', JSON.stringify({id}))
        );
    }


    GetEventsCounts()
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/events/counts.json', '')
        );
    }

    GetEventsIndividual(params)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/events/individual.json', this.typeService.ParamsToUrlSearchParams(params))
        );
    }

    GetEventsNewStatus(by:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/events/new_status.json', this.typeService.ParamsToUrlSearchParams({by}))
        );
    }

    GetEventsGraph(by:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/events/graph.json', this.typeService.ParamsToUrlSearchParams({by}))
        );
    }

    EventView(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/events/'+id+'/view.json', JSON.stringify({id}))
        );
    }


    //////////////////////////////////////
    //////         FEEDBACK         //////
    //////////////////////////////////////


    FeedbackThankYou(id:number,message:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/feedbacks/'+id+'/thank_you.json', JSON.stringify({id, message}))
        );
    }
    FeedbackForward(id:number,receiver:number,message:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/feedbacks/'+id+'/forward.json', JSON.stringify({id,receiver, message}))
        );
    }
    FeedbackDelete(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.DeleteDataWithBody('/admin/feedbacks/'+id+'.json', JSON.stringify({id}))
        );
    }
    GetFeedbacks(params:any)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/feedbacks.json', this.typeService.ParamsToUrlSearchParams(params))
        );
    }
    GetFeedbackById(id)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/feedbacks/'+id+'.json', this.typeService.ParamsToUrlSearchParams({id}))
        );
    }
    GetFeedbacksCounts()
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/feedbacks/counts.json', '')
        );
    }
    GetFeedbacksOverall()
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/feedbacks/overall.json', '')
        );
    }
    GetFeedbacksGraph(by?:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/feedbacks/graph.json', this.typeService.ParamsToUrlSearchParams({by}))
        );
    }


    //////////////////////////////////////
    //////         QUESTIONS        //////
    //////////////////////////////////////


    QuestionReplyById(id:number,subject:string,message:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/questions/'+id+'/reply.json', JSON.stringify({id,subject,message}))
        );
    }
    QuestionDelete(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.DeleteDataWithBody('/admin/questions/'+id+'.json', JSON.stringify({id}))
        );
    }
    GetQuestions()
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/questions.json', '')
        );
    }
    GetQuestionById(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/questions/'+id+'.json', this.typeService.ParamsToUrlSearchParams({id}))
        );
    }
    SolveQuestion(id:number,subject:string,message:string)
    {
      return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/questions/'+id+'/close.json', JSON.stringify({id,subject,message}))
        );
    }


    //////////////////////////////////////
    //////           REPLY          //////
    //////////////////////////////////////


    GetReplyTemplates()
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/reply_templates.json', '')
        );
    }

    AddReplyTemplate(subject:string,message:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/reply_templates.json', JSON.stringify({subject,message}))
        );
    }

    DeleteReplyTemplate(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.DeleteDataWithBody('/admin/reply_templates/'+id+'.json', JSON.stringify({id}))
        );
    }

    PatchReplyTemplate(id:number,subject:string,message:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.PatchData('/admin/reply_templates/'+id+'.json',JSON.stringify({id,subject,message}))
        );
    }

    GetReplyTemplateById(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/reply_templates/'+id+'.json', this.typeService.ParamsToUrlSearchParams({id}))
        );
    }

    ApproveTemplatyById(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/reply_templates/'+id+'/approve.json', JSON.stringify({id}))
        );
    }


    //////////////////////////////////////
    //////         QUESTIONS        //////
    //////////////////////////////////////


    GetRevenues()
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/revenue.json', '')
        );
    }
    GetRevenueById(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/revenue/'+id+'.json', '')
        );
    }

    GetRevenueCities(type:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/revenue/cities.json', this.typeService.ParamsToUrlSearchParams({type}))
        );
    }

    GetRevenueCounts(type:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/revenue/counts.json', this.typeService.ParamsToUrlSearchParams({type}))
        );
    }

    GetRevenueCountsAdvertising(type:string, by:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/revenue/counts/advertising.json', this.typeService.ParamsToUrlSearchParams({type,by}))
        );
    }

    GetRevenueCountsDate(type:string, by:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/revenue/counts/date.json', this.typeService.ParamsToUrlSearchParams({type,by}))
        );
    }

    GetRevenueCountsArtist(type:string, by:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/revenue/counts/artist.json', this.typeService.ParamsToUrlSearchParams({type,by}))
        );
    }

    GetRevenueCountsFunding(type:string, by:string, funding_type:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/revenue/counts/funding.json', this.typeService.ParamsToUrlSearchParams({type,by,funding_type}))
        );
    }

    GetRevenueCountsTickets(type:string, by:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/revenue/counts/tickets.json', this.typeService.ParamsToUrlSearchParams({type,by}))
        );
    }

    GetRevenueCountsVenue(type:string, by:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/revenue/counts/venue.json', this.typeService.ParamsToUrlSearchParams({type,by}))
        );
    }

    GetRevenueCountsVr(type:string, by:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/revenue/counts/vr.json', this.typeService.ParamsToUrlSearchParams({type,by}))
        );
    }

    GetAnswerReplyTemplates()
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/reply_templates/to_answer.json', '')
        );
    }


    //////////////////////////////////////
    //////         MESSAGES         //////
    //////////////////////////////////////

    GetMessages()
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/messages.json', '')
        );
    }
    GetMessagesById(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/messages/'+id+'/.json',  this.typeService.ParamsToUrlSearchParams({id}))
        );
    }
    SendMessage(topic_id:number,receiver:number,topic:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/messages.json', JSON.stringify({topic_id,receiver,topic}))
        );
    }
    ForwardMessage(id:number,receiver_id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/messages/'+id+'/forward.json', JSON.stringify({id,receiver_id}))
        );
    }
    SolveMessage(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/messages/'+id+'/solve.json', JSON.stringify({id}))
        );
    }
    SendMessageToNewDialog(receivers_ids:number[],message:string,topic:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/messages/new.json', JSON.stringify({receivers_ids,message,topic}))
        );
    }

    GetAdminsList(){
      return this.http.CommonRequest(
            ()=> this.http.GetData('/admin.json', '')
        );
    }


}

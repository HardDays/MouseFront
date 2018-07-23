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

    // this.typeService.ParamsToUrlSearchParams({})
    constructor(private http: HttpService, private typeService:TypeService){
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


    //////////////////////////////////////
    //////         FEEDBACK         //////   
    //////////////////////////////////////


    FeedbackThankYou(id:number,message:string)
    {
        return this.http.CommonRequest(
            ()=> this.http.PostData('/admin/feedbacks/'+id+'/thank_you.json', JSON.stringify({id, message}))
        );
    }
    FeedbackDelete(id:number)
    {
        return this.http.CommonRequest(
            ()=> this.http.DeleteDataWithBody('/admin/feedbacks/'+id+'.json', JSON.stringify({id}))
        );
    }
    GetFeedbacks()
    {
        return this.http.CommonRequest(
            ()=> this.http.GetData('/admin/feedbacks.json', '')
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





}
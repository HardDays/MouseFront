import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { Router } from "@angular/router";
import { AccountGetModel } from "../models/accountGet.model";
import { AccountCreateModel } from "../models/accountCreate.model";
import { Subject } from "rxjs";

@Injectable()
export class AccountService{
    public onAuthChange$: Subject<boolean>;
    public onLoadingChange$: Subject<boolean>;
    //public pushNotif:NotificationsComponent = new NotificationsComponent();
    constructor(private http: HttpService, private router: Router){
        this.onAuthChange$ = new Subject();
        this.onAuthChange$.next(false);
        this.onLoadingChange$ = new Subject();
        this.onLoadingChange$.next(false);
    }

    UserModelToCreateUserModel(input:AccountGetModel){
        let result = new AccountCreateModel();
        if(input){
            result.user_name = input.user_name?input.user_name:'';
            result.display_name = input.display_name?input.display_name:'';
            result.phone = input.phone?input.phone:'';
            result.account_type = input.account_type;
            result.image = '';
        }
        return result;
    }

    GetMyAccount(){
        return this.http.GetData('/accounts/my.json',"");
    }

    AccountFollow(id:number,follower_id:number){
    let params={
        id:id,
        follower_id:follower_id
    }
    return this.http.PostData('/accounts/+'+id+'/follow.json',JSON.stringify(params));
    }
}
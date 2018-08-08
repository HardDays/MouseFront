import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Injectable } from '@angular/core';
import { AccountCreateModel } from '../core/models/accountCreate.model';
import { AuthMainService } from '../core/services/auth.service';
import { BaseComponent } from '../core/base/base.component';

@Injectable()
export class SystemAccessGuard extends BaseComponent implements CanActivate{
    /*constructor(private service: MainService,private router: Router){
    }*/
    admin = false;
    canActivate(router:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean{

        // console.log(router.routeConfig.path, this.main.MyUser.id, localStorage.getItem('new_user_'+this.main.MyUser.id));
        
        //потом просто удалить
        if(localStorage.getItem('access')!='true') this.router.navigate(['/access']);
        let login = this.main.authService.IsLogedIn();
        this.admin = this.main.MyUser.is_admin||this.main.MyUser.is_superuser;
      
        if(login&&this.admin){
            this.router.navigate(['/admin']);
        }

        this.main.UserChange.subscribe(
            ()=>{
                login = this.main.authService.IsLogedIn();
                this.admin = this.main.MyUser.is_admin||this.main.MyUser.is_superuser;
                if(login&&this.admin){
                    this.router.navigate(['/admin']);
                }
            }
        )
      
        if(login&&this.admin){
            this.router.navigate(['/admin']);
        }
        else switch(router.routeConfig.path){
            case "profile":{
                if(!login){
                    return this.main.authService.onAuthChange$;
                    //return this.LoginNavigate();
                }
                else{
                    return true;
                }
            }
            case "feed":{
                    return true;
            }
            case "tickets":{
                if(!login){
                    return this.LoginNavigate();
                }
                else{
                    return true;
                }
            }
            case "eventCreate":{
                if(!login){
                    return this.LoginNavigate();
                }
                else{
                    return true;
                }
            }
            case "artistCreate":{
                if(!login){
                    return this.LoginNavigate();
                }
                else{
                    return true;
                }
            }
            case "venueCreate":{
                if(!login){
                    return this.LoginNavigate();
                }
                else{
                    return true;
                }
            }
            case "events":{
                    return true;
            }
            default:{
                return true;
            }
            case "messages":{
                if(!login){
                    return this.LoginNavigate();
                }
                else{
                    return true;
                }
            }
            case "settings":{
                if(!login){
                    return this.LoginNavigate();
                }
                else{
                    return true;
                }
            }
            case "shows":{
                if(localStorage.getItem('new_user')&&this.main.MyAccounts.length===0){
                    localStorage.removeItem('new_user');
                    this.Logout();
                }
                return true;
            }
            
        }
    }
    
    LoginNavigate(){

        if(this.admin)
            this.router.navigate(['/admin','dashboard']);
        else
            this.router.navigate(['/system','shows']);
        return false;
    }
}
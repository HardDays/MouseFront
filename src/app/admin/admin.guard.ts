import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Injectable } from '@angular/core';
import { AccountCreateModel } from '../core/models/accountCreate.model';
import { AuthMainService } from '../core/services/auth.service';
import { BaseComponent } from '../core/base/base.component';

@Injectable()
export class AdminAccessGuard extends BaseComponent implements CanActivate{
    /*constructor(private service: MainService,private router: Router){
    }*/
    canActivate(router:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean{

        //потом просто удалить
        if(localStorage.getItem('access')!='true') this.router.navigate(['/access']);
        
        let login = this.main.authService.IsLogedIn();

        let admin = this.main.MyUser.is_admin||this.main.MyUser.is_superuser;


        if(!login||!admin){
            return this.LoginNavigate();
        }
        else{
            return true;
        }
        // return true;
            // switch(router.routeConfig.path){
            //     case "profile":{
            //         if(!login){
            //             return this.main.authService.onAuthChange$;
            //             //return this.LoginNavigate();
            //         }
            //         else{
            //             return true;
            //         }
            //     }
            //     case "feed":{
            //         if(!login){
            //             return this.LoginNavigate();
            //         }
            //         else{
            //             return true;
            //         }
            //     }
            //     case "tickets":{
            //         if(!login){
            //             return this.LoginNavigate();
            //         }
            //         else{
            //             return true;
            //         }
            //     }
            //     case "eventCreate":{
            //         if(!login){
            //             return this.LoginNavigate();
            //         }
            //         else{
            //             return true;
            //         }
            //     }
            //     case "artistCreate":{
            //         if(!login){
            //             return this.LoginNavigate();
            //         }
            //         else{
            //             return true;
            //         }
            //     }
            //     case "venueCreate":{
            //         if(!login){
            //             return this.LoginNavigate();
            //         }
            //         else{
            //             return true;
            //         }
            //     }
            //     case "events":{
            //             return true;
            //     }
            //     default:{
            //         return true;
            //     }
            //     case "messages":{
            //         if(!login){
            //             return this.LoginNavigate();
            //         }
            //         else{
            //             return true;
            //         }
            //     }
            //     case "settings":{
            //         if(!login){
            //             return this.LoginNavigate();
            //         }
            //         else{
            //             return true;
            //         }
            //     }
            
       // }
    }
    
    LoginNavigate(){
        this.router.navigate(['/login']);
        return false;
    }
}
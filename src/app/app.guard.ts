import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Injectable } from '@angular/core';
import { BaseComponent } from "./core/base/base.component";

@Injectable()
export class AppAccessGuard extends BaseComponent implements CanActivate{
    admin = false;

    canActivate(router:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean{

        let login = this.main.authService.IsLogedIn();

        this.admin = this.main.MyUser.is_admin||this.main.MyUser.is_superuser;


        switch(router.routeConfig.path){
            case "access":{
                return this.LoginHandler(router,state);
            }

            case "login":{
                if(login){
                    return this.LoginNavigate();
                }
                else{
                    return true;
                }
            }

            case "social":{
                if(!login){
                    return this.LoginNavigate();
                }
                else{
                    return true;
                }
            }
        
            case "register":{
                if(login){
                    return this.LoginNavigate();
                }
                else{
                    return true;
                }
            }

            default:{
                return true;
            }
        }
    }

    private LoginHandler(router:ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean{

        // if(localStorage.getItem('access')==='true')
        // {
        //     if(!this.admin)
        //     {
        //         this.router.navigate(['/system','shows']);
        //     }
        //     else
        //     {
        //         this.router.navigate(['/admin','dashboard']);
        //     }
        //     return false;
        // }
        return true;
        
    }

    LoginNavigate(){
        if(this.admin)
            this.router.navigate(['/admin','dashboard']);
        else
            this.router.navigate(['/system','shows']);
        return false;
    }
}
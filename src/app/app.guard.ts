import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Rx";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Injectable } from '@angular/core';


@Injectable()
export class AppAccessGuard implements CanActivate{
    
    canActivate(router:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean{

        switch(router.routeConfig.path){
            case "login":{
                return this.LoginHandler(router,state);
            }
            default:{
                return true;
            }
        }
    }

    private LoginHandler(router:ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean{

    //    // this.router.navigate(['/system','table']);
    //     if(this.isLoggedIn){
    //         this.router.navigate(['/system','table']);
    //         return false;
    //     }
        
        return true;
        
    }
}
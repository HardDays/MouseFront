import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Rx";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Injectable } from '@angular/core';
import { BaseComponent } from "./core/base/base.component";

@Injectable()
export class AppAccessGuard extends BaseComponent implements CanActivate{
    
    canActivate(router:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean{

        switch(router.routeConfig.path){
            case "access":{
                return this.LoginHandler(router,state);
            }
           
            default:{
                return true;
            }
        }
    }

    private LoginHandler(router:ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean{

        if(localStorage.getItem('access')=='true')
        {
            this.router.navigate(['/system','shows']);
                return false;
        }       
        
        return true;
        
    }
}
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Rx";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Injectable } from '@angular/core';
import { UserModel } from './../core/models/user.model';
import { MainService } from './../core/services/main.service';
import { BaseComponent } from '../core/base/base.component';

@Injectable()
export class SystemAccessGuard extends BaseComponent implements CanActivate{
    /*constructor(private service: MainService,private router: Router){
    }*/
    canActivate(router:ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean{
        let login = this.service.IsLogedIn();
        switch(router.routeConfig.path){
            case "open":{
                if(login){
                    return true;
                }
                else{
                    return this.LoginNavigate();
                }
            }
            
            default:{
                return true;
            }
        }
    }
    
    LoginNavigate(){
        this.router.navigate(['/login']);
        return false;
    }
}
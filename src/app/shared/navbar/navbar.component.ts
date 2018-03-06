import { Component, OnInit, ElementRef } from '@angular/core';

import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

import { Router } from '@angular/router';

import { Base64ImageModel } from '../../core/models/base64image.model';
import { BaseComponent } from '../../core/base/base.component';

import { AccountGetModel } from '../../core/models/accountGet.model';

@Component({
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html',
    styleUrls: ['./navbar.component.css']
})

export class NavbarComponent extends BaseComponent implements OnInit{

    isShown:boolean = true;
    Accounts:AccountGetModel[] = [];
    maxNumberOfProfiles:number = 5;
    curNav:string = 'shows';
  
    ngOnInit(){
      this.initUser();
    }

    initUser(){
        this.accService.GetMyAccount({extended:true})
        .subscribe((users:any[])=>{
            if(users.length >= this.maxNumberOfProfiles)
              this.isShown = false;
            this.Accounts = users;
        });
    }

    Navigate(params:string[]){
        this.router.navigate(params);
    }

    LOGOUT_STUPID(){
        localStorage.removeItem('access');
        this.router.navigate(['/access']);
    }
      
      login(){
        this.router.navigate(['/login']);
      }
    
      logout(){
        console.log('logout');
        this.Logout();
        this.initUser();
        this.curNav = 'shows';
      }
    
      edit(){
        this.router.navigate(['/system','edit']);
      }

}
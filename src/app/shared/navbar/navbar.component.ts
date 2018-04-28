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
    idProfile:number = 0;
    Accounts:AccountGetModel[] = [];
    maxNumberOfProfiles:number = 5;
    curNav:string = 'shows';
  
    ngOnInit(){
      this.initUser();
      this.main.accService.onAuthChange$
      .subscribe((res:boolean)=>{
          if(res)
            this.initUser();
      });
      
      this.curNav = this.getThisPage();
      
      this.GetMyAccounts();
    
    }

    getThisPage():string{
      var page:string = 'shows';
      var url = this.router.routerState.snapshot.url;

      if(url){
        var url_comp = url.split('/');
        page = url_comp[2];
      }

      if (page == 'eventCreate')
        page = 'events';

      return page;
    }

    initUser(){

        this.main.accService.GetMyAccount({extended:true})
        .subscribe((users:any[])=>{
            if(users.length >= this.maxNumberOfProfiles)
              this.isShown = false;
            this.Accounts = users;
            this.idProfile = this.GetCurrentAccId();
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
        //console.log('logout');
        this.Logout();
        // this.initUser();
        this.curNav = 'shows';
      }
    
      edit(){
        this.router.navigate(['/system','edit']);
      }

      setProfile(item:AccountGetModel){
        this.curNav = 'profile';
        this.router.navigate(['/system/profile',item.id]);
        this.main.CurrentAccountChange.next(item);
        // localStorage.setItem('activeUserId',''+id);
      }

      getProfileNameById(){
        for(let profile of this.MyAccounts)
          if(profile.id==this.idProfile)
            return profile.user_name;
        return '';
      }

      updateProfiles(){
        //console.log(`update profiles`);
        this.initUser();
      }



}

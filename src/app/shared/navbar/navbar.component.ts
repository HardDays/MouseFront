import { Component, OnInit, ElementRef } from '@angular/core';

import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

import { Router } from '@angular/router';

import { Base64ImageModel } from '../../core/models/base64image.model';
import { BaseComponent } from '../../core/base/base.component';

import { AccountGetModel } from '../../core/models/accountGet.model';
import { BaseImages } from '../../core/base/base.enum';

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
    ActiveAccount = new AccountGetModel();
    ImageUser:string = '';
    ngOnInit(){
      this.initUser();
      this.accService.onAuthChange$
      .subscribe((res:boolean)=>{
          if(res)
            this.initUser();
      });
      
      this.curNav = this.getThisPage();
    
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

        this.accService.GetMyAccount({extended:true})
        .subscribe((users:any[])=>{
            if(users.length >= this.maxNumberOfProfiles)
              this.isShown = false;
            this.Accounts = users;
          
            this.idProfile = +localStorage.getItem('activeUserId');
            this.ActiveAccount = this.Accounts.find(obj => obj.id == this.idProfile);
            this.GetImage();
            console.log("this.ActiveAccount");
            console.log(this.ActiveAccount);
        });
    }
    GetImage()
    {
        
          if(this.ActiveAccount.image_id)
          {
              this.WaitBeforeLoading(
                  () => this.imgService.GetImageById(this.ActiveAccount.image_id),
                  (res:Base64ImageModel) => {
                  
                      this.ImageUser = (res && res.base64) ? res.base64 : BaseImages.Drake;
                      
                  },
                  (err) =>{
                    this.ImageUser = BaseImages.Drake;
                  }
              );
          }
          else{
            this.ImageUser = BaseImages.Drake;
          }
        
      
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

      setProfile(id:number){
        this.curNav = 'profile';
        this.router.navigate(['/system/profile',id]);
        localStorage.setItem('activeUserId',''+id);
        this.idProfile = id;
        this.ActiveAccount = this.Accounts.find(obj => obj.id == this.idProfile);
        this.GetImage();
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

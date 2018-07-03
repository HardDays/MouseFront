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

export class NavbarComponent extends BaseComponent implements OnInit
{

    curNav:string = 'shows';
    MyLogo:string = '';
    ngOnInit()
    {
      // this.MyLogo = this.main.MyLogo;
      this.MyLogo = this.main.MyUserLogo;
      this.curNav = this.getThisPage();
      this.main.MyUserLogoChange.subscribe(
        (res)=>{
          this.MyLogo = res;
        }
      );
      this.main.GetMyAccounts();

    }

    getThisPage():string
    {
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

    Navigate(params?:string[])
    {
      
      if(params && params.length)
        this.router.navigate(params);
    }

    LOGOUT_STUPID()
    {
        localStorage.removeItem('access');
        this.router.navigate(['/access']);
    }
      
      login()
      {
        this.router.navigate(['/login']);
      }
    
      logout()
      {
        this.Logout();
        // this.initUser();
        this.curNav = 'shows';
      }
    
      edit()
      {
        this.router.navigate(['/system','edit']);
      }

      setProfile(item:AccountGetModel)
      {
        this.curNav = 'profile';
        this.main.CurrentAccountChange.next(item);
        this.router.navigate(['/system/profile',item.id]);
        // if (this.router.url === "/system/profile/" + item.id) {
        //   location.reload();
        // }
        // else{
        //   this.router.navigate(['/system/profile',item.id]);
        // }
      }

      CheckModalWindows(page:string)
      {
        console.log("new_page",page);
        console.log("current_page",this.getThisPage());
      }

}

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
      this.MyLogo = this.main.MyLogo;
      this.curNav = this.getThisPage();
      this.main.MyLogoChange.subscribe(
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

    Navigate(params:string[])
    {
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
        //console.log('logout');
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
        this.router.navigate(['/system/profile',item.id]);
        this.main.CurrentAccountChange.next(item);
       
      }



}

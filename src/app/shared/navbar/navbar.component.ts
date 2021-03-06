import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

import { Router, NavigationEnd } from '@angular/router';

import { Base64ImageModel } from '../../core/models/base64image.model';
import { BaseComponent } from '../../core/base/base.component';

import { AccountGetModel } from '../../core/models/accountGet.model';
import { BaseImages } from '../../core/base/base.enum';
import { TranslateService } from '@ngx-translate/core';

export enum Pages {
  Shows = "shows",
  Events = "event",
  Tickets = "tickets",
  Feed = "feed",
  Profile = "profile"
}

@Component({
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html',
    styleUrls: ['./navbar.component.css']
})

export class NavbarComponent extends BaseComponent implements OnInit
{
    translate: TranslateService;
    translang: string;
    curNav:string = 'shows';
    MyLogo:string = '';
    Search = {
      text:''
    };

    countMessages = 0;


    @ViewChild('SearchForm') form: NgForm;
    ngOnInit()
    {

      this.translate.setDefaultLang(this.settings.GetLang());
      this.translang = "ENG";
      this.switchlang();
      this.MyLogo = this.main.MyLogo;
      // this.MyLogo = this.main.MyUserLogo;
      this.curNav = this.getThisPage();
      this.main.MyLogoChange.subscribe(
        (res)=>{
          this.MyLogo = res;
        }
      );

      this.router.events.subscribe(
        (Val) => {
          if(Val instanceof NavigationEnd)
          {
            this.curNav = this.getThisPage();

          }
        }
      );

      this.main.MyAccountsChange.subscribe((res)=>{
        if(res&&this.CurrentAccount.id)
          this.getMessageCount();
      })

      if(this.isLoggedIn)
        this.main.GetMyAccounts();




      // localStorage.setItem('new_user_134','artist');

      this.main.MyAccountsChange.subscribe(
        ()=>{
          if(this.isLoggedIn&&this.MyUser.id){
            if(this.MyAccounts.length===0){
              if(!localStorage.getItem('is_register')){

                let type = localStorage.getItem('new_user_'+this.MyUser.id);
                // localStorage.removeItem('new_user_'+this.MyUser.id);
                localStorage.setItem('new_user','true');
                // if(type){
                  if(type=='venue')
                    this.router.navigate(['/system','venueCreate','new']);
                  else if(type=='artist')
                    this.router.navigate(['/system','artistCreate','new']);
                  else
                    this.router.navigate(['/system','fanCreate','new']);
                // }
              }
            }
            else {
              localStorage.removeItem('new_user_'+this.MyUser.id);
            }
          }
        }
      )

      this.main.accService.onMessagesChange$
        .subscribe(()=>{
          this.getMessageCount();
      });
    }

    getMessageCount(){
      this.main.accService.GetInboxMessagesUnreadCount(this.CurrentAccount.id)
        .subscribe(
          (res)=>{
            this.countMessages = res.count;
          }
        )
    }

    ShowSearchResult()
    {
      this.router.navigate(['/system','search'], {queryParams: this.Search});
      this.Search.text = '';
    }
    getThisPage():string
    {
      // var page:string = 'shows';
      var url = this.router.routerState.snapshot.url;
      for (const item of Object.values(Pages))
      {
        if( url.indexOf(item) != -1)
        {
          return item;
        }
      }
      return Pages.Profile;
      // if(url){
      //   var url_comp = url.split('/');
      //   page = url_comp[2];
      // }

      // if (page == 'eventCreate')
      //   page = 'events';

      // return page;
    }
    useLanguage(language: string) {
      this.translate.use(language);
      this.main.settings.SetLocalLang(language);
      this.switchlang(language);
    }

    switchlang(lang?){
      if(lang)
        lang == 'en'?this.translang = "ENG":this.translang = "РУС";
      else
        this.settings.GetLang() == 'en'?this.translang = "ENG":this.translang = "РУС";
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
        this.getMessageCount();


        // if (this.router.url === "/system/profile/" + item.id) {
        //   location.reload();
        // }
        // else{
        //   this.router.navigate(['/system/profile',item.id]);
        // }
      }

      CheckModalWindows(page:string)
      {
      }

      openCalendar()
      {
        this.Navigate(['/system','calendar']);
      }

}

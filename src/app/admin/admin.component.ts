import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../core/base/base.component';
import { Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { UserGetModel } from '../core/models/userGet.model';

declare var $:any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent extends BaseComponent implements OnInit {

  pages = Parts;
  currentPage = Parts.dashboard;

  User:UserGetModel = new UserGetModel();
  openMenu = false;

  newAccCount = 0;
  newEventCount = 0;

  ngOnInit() {
    this.initJs();
    this.GetCurrentRoute();
    this.router.events.subscribe( (event: Event) => {
      if (event instanceof NavigationEnd) {
          this.GetCurrentRoute();
      }
    });
    // this.User = this.main.MyUser;

    this.main.adminService.GetMyAccByIdUser(this.main.MyUser.id)
          .subscribe(
            (res)=>{
              this.User = res;
              this.User.is_admin = this.main.MyUser.is_admin;
              this.User.is_superuser = this.main.MyUser.is_superuser;
            }
          )

    this.main.UserChange.subscribe(
      (res)=>{
        this.main.adminService.GetMyAccByIdUser(this.main.MyUser.id)
          .subscribe(
            (res)=>{
              this.User = res;
              this.User.is_admin = this.main.MyUser.is_admin;
              this.User.is_superuser = this.main.MyUser.is_superuser;
            }
          )
        // this.User = this.main.MyUser;
      }
    )
    // if(this.User.image_id){
    //   this.main.imagesService.GetImageById(this.User.image_id)
    //     .subscribe((res)=>{
    //       console.log(`res img`, res);
    //       this.User.image_base64 = res.base64;
    //     })
    // }
    console.log(this.User);

    this.getNewCounts();

  }

  getNewCounts(){
    this.main.adminService.GetNewAccountsCount()
      .subscribe(
        (res)=>{
          this.newAccCount = res;
        }
      )

    this.main.adminService.GetNewEventsCount()
      .subscribe(
        (res)=>{
          this.newEventCount = res;
        }
      )
    
  }

  GetCurrentRoute(){
    let url = this.router.url.split('/');
    if(url.length === 3){
      switch(url[2]){
        case 'dashboard':  this.currentPage = Parts.dashboard;
          break;
        case 'settings':  this.currentPage = Parts.settings;
          break;
        case 'add-admin':  this.currentPage = Parts.add_new_admin;
          break;
      }
    }
    else if(url.length === 4){
      switch(url[2]){
        case 'accounts':
          switch(url[3]){
            case 'all': this.currentPage = Parts.accounts_all; 
              break;
            case 'new': this.currentPage = Parts.accounts_new; 
              break;
            case 'pending': this.currentPage = Parts.accounts_pending;
              break;
            case 'approved': this.currentPage = Parts.accounts_approved;
              break;
            case 'inactive': this.currentPage = Parts.accounts_inactive;
              break;
            case 'denied': this.currentPage = Parts.accounts_denied;
              break;
            case 'invites': this.currentPage = Parts.accounts_invites;
              break;
            case 'analytics': this.currentPage = Parts.accounts_analytics;
              break;
          }
          break;

        case 'events':
          switch(url[3]){
            case 'all': this.currentPage = Parts.events_all; 
              break;
            case 'new': this.currentPage = Parts.events_new; 
              break;
            case 'pending': this.currentPage = Parts.events_pending;
              break;
            case 'approved': this.currentPage = Parts.events_approved;
              break;
            case 'inactive': this.currentPage = Parts.events_inactive;
              break;
            case 'denied': this.currentPage = Parts.events_denied;
              break;
            case 'active': this.currentPage = Parts.events_active;
              break;
            case 'analytics': this.currentPage = Parts.events_analytics;
              break;
          }
          break;

          case 'account':
            this.currentPage = Parts.artist;
          break;

          case 'event':
            this.currentPage = Parts.event;
          break;
      }
    }

    
    
  }


  initJs(){
    $(document).ready(function () {
      $('.photos-abs-wrapp').css({
          'max-height': $('.rel-wr-photoos').width()+'px'
      });
  
      $(window).resize(function(){
          $('.photos-abs-wrapp').css({
              'max-height': $('.rel-wr-photoos').width()+'px'
          });
      });
  });
  }

}


export enum Parts {
  dashboard = 0,
  accounts_all = 1,
  accounts_new = 2,
  accounts_pending = 3,
  accounts_approved = 4,
  accounts_denied = 5,
  accounts_inactive = 6,
  accounts_invites = 7,
  accounts_analytics = 8,
  artist = 9,
  venue = 10,
  events_all = 11,
  events_new = 12,
  events_pending = 13,
  events_approved = 14,
  events_denied = 15,
  events_active = 16,
  events_inactive = 17,
  events_analytics = 18,
  event = 19,
  feedback = 20,
  feedback_analytics = 21,
  support = 22,
  revenue = 23,
  revenue_info = 24,
  revenue_analytics = 25,
  settings = 26,
  add_new_admin = 27,
  customer_support = 28,
  customer_answers = 29
}
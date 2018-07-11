import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../core/base/base.component';
import { Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent extends BaseComponent implements OnInit {

  pages = Parts;
  currentPage = Parts.dashboard;

  ngOnInit() {
    this.initJs();
    this.GetCurrentRoute();
    this.router.events.subscribe( (event: Event) => {
      if (event instanceof NavigationEnd) {
          this.GetCurrentRoute();
      }
    });

  }

  GetCurrentRoute(){
    let url = this.router.url.split('/');
    if(url.length === 3){
      switch(url[2]){
        case 'dashboard':  this.currentPage = Parts.dashboard;
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
  events_all = 10,
  events_new = 11,
  events_pending = 12,
  events_approved = 13,
  events_denied = 14,
  events_active = 15,
  events_inactive = 16,
  events_analytics = 17,
  feedback_analytics = 18,
  support = 19,
  revenue = 20,
  revenue_info = 21,
  settings = 22,
  add_new_admin = 23
}
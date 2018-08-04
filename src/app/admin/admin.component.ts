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

  openSubmenu = {
    account:false,
    event: false,
    feedback:false,
    support:false,
    revenue: false,
    settings: false
  };

  currentPosition = 200;

  ngOnInit() {
    this.initJs();
    this.GetCurrentRoute();
    this.router.events.subscribe( (event: Event) => {
     
      if (event instanceof NavigationEnd) {
          this.GetCurrentRoute();
          window.scroll(0,this.currentPosition);
      }
    });


    window.addEventListener('scroll', ()=> {
      this.currentPosition =  window.scrollY ;
    });


    console.log(this.main.MyUser.id);

    if(this.main.MyUser.id && (this.main.MyUser.is_admin||this.main.MyUser.is_superuser)){
      this.main.adminService.GetMyAccByIdUser(this.main.MyUser.id)
            .subscribe(
              (res)=>{
                this.User = res;
                
                if(this.User.image_id)
                  this.User.image_base64 = this.main.imagesService.GetImagePreview(this.User.image_id,{width:100,height:100});

                this.User.is_admin = this.main.MyUser.is_admin;
                this.User.is_superuser = this.main.MyUser.is_superuser;

                this.getNewCounts();
              }
            )
    }

    this.main.UserChange.subscribe(
      (res)=>{
        if(res&&this.main.MyUser.id&& (this.main.MyUser.is_admin||this.main.MyUser.is_superuser)){
          this.main.adminService.GetMyAccByIdUser(this.main.MyUser.id)
            .subscribe(
              (res)=>{
                this.User = res;
                
                if(this.User.image_id)
                  this.User.image_base64 = this.main.imagesService.GetImagePreview(this.User.image_id,{width:100,height:100});
                  
                this.User.is_admin = this.main.MyUser.is_admin;
                this.User.is_superuser = this.main.MyUser.is_superuser;

                this.getNewCounts();
              }
            )
        }
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
    // console.log(this.User);

    // this.getNewCounts();
    this.main.adminService.NewCountChange.subscribe(
      ()=>{
        this.getNewCounts();
        // this.newAccCount =  this.newAccCount - 1;
      }
    )

  }

  getNewCounts(){

    if(this.User.is_admin||this.User.is_superuser){
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
        case 'feedback':
          this.currentPage = Parts.feedback;
        break;
        case 'customer':
          this.currentPage = Parts.customer_support;
        break;
        case 'revenues':
          this.currentPage = Parts.revenue;
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
            case 'funding': this.currentPage = Parts.accounts_funding;
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

          case 'revenue':
            this.currentPage = Parts.revenue_info;
          break;

          case 'feedback':
            if(url[3]==='analytics')
              this.currentPage = Parts.feedback_analytics;
          break;

          case 'customer':
          if(url[3]==='answers')
              this.currentPage = Parts.customer_answers;
          break;

          case 'revenues':
            if(url[3]==='analytics')
              this.currentPage = Parts.revenue_analytics;
            else
              this.currentPage = Parts.revenue_info;
          break;

          case 'settings':
            if(url[3]==='add-admin')
              this.currentPage = Parts.add_new_admin;
          break;
          
      }
    }

    
    
  }


  initJs(){
  //   $(document).ready(function () {
  //     $('.photos-abs-wrapp').css({
  //         //'max-height': $('.rel-wr-photoos').width()+'px'
  //     });
  
  //     $(window).resize(function(){
  //         $('.photos-abs-wrapp').css({
  //             //'max-height': $('.rel-wr-photoos').width()+'px'
  //         });
  //     });
  // });
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
  accounts_funding = 9,
  artist = 10,
  venue = 11,
  events_all = 12,
  events_new = 13,
  events_pending = 14,
  events_approved = 15,
  events_denied = 16,
  events_active = 17,
  events_inactive = 18,
  events_analytics = 19,
  event = 20,
  feedback = 21,
  feedback_analytics = 22,
  support = 23,
  revenue = 24,
  revenue_info = 25,
  revenue_analytics = 26,
  settings = 27,
  add_new_admin = 28,
  customer_support = 29,
  customer_answers = 30
}
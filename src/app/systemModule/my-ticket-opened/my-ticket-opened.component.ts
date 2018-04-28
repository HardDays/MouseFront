import { Component, OnInit, NgZone } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { Router, Params,ActivatedRoute  } from '@angular/router';
import { AuthMainService } from '../../core/services/auth.service';
import { AccountService } from '../../core/services/account.service';
import { GenresService } from '../../core/services/genres.service';
import { AuthService } from 'angular2-social-login';
import { MapsAPILoader } from '@agm/core';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
import { EventService } from '../../core/services/event.service';
import { TypeService } from '../../core/services/type.service';
import { ImagesService } from '../../core/services/images.service';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { NgForm } from '@angular/forms';
import { AccountType } from '../../core/base/base.enum';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { TicketsGetModel } from '../../core/models/ticketsGetModel';
import { BaseImages } from '../../core/base/base.enum';
import { TicketsByEventModel } from '../../core/models/ticketsByEvent.model';

@Component({
  selector: 'app-my-ticket-opened',
  templateUrl: './my-ticket-opened.component.html',
  styleUrls: ['./my-ticket-opened.component.css']
})
export class MyTicketOpenedComponent extends BaseComponent implements OnInit{
  event_id:number;
  accountId:number;
  TotalPrice:number = 0;
  TicketsByEvent:TicketsByEventModel = new TicketsByEventModel();
  Image:string;
  constructor(protected authService: AuthMainService,
    protected accService:AccountService,
    protected imgService:ImagesService,
    protected typeService:TypeService,
    protected genreService:GenresService,
    protected eventService:EventService,
    protected _sanitizer: DomSanitizer,
    protected router: Router,public _auth: AuthService,
    private mapsAPILoader: MapsAPILoader, 
    private ngZone: NgZone, protected h:Http,
    private activatedRoute: ActivatedRoute){
    super(authService,accService,imgService,typeService,genreService,eventService,_sanitizer,router,h,_auth);
  }

  ngOnInit() {
    
  this.activatedRoute.params.forEach((params) => {
    this.event_id = params["id"];
    this.initUser();
  });
 
  



  }

  GetImage()
  {
      if(this.TicketsByEvent.event && this.TicketsByEvent.event.image_id)
      {
          this.WaitBeforeLoading(
              () => this.imgService.GetImageById(this.TicketsByEvent.event.image_id),
              (res:Base64ImageModel) => {
              
                  this.Image = (res && res.base64) ? res.base64 : BaseImages.Drake;
              },
              (err) =>{
                  this.Image = BaseImages.Drake;
              }
          );
      }
      else{
          this.Image = BaseImages.Drake;
      }
  }


  initUser(){
    this.accService.GetMyAccount({extended:true})
    .subscribe((users:any[])=>{
        for(let u of users)
        if(u.id==+localStorage.getItem('activeUserId')){
          this.accountId = u.id;
          this.GetTicketsByEvent();
         
        }
    });
  }

  GetTicketsByEvent()
  {
      
      this.WaitBeforeLoading(
          () => this.eventService.GetTicketsByEvent(this.accountId,this.event_id),
          (res:TicketsByEventModel) =>
          { 
              this.TicketsByEvent = res;
              this.GetImage();
              this.CountTotalPrice();
          },
          (err) => {
              console.log(err);
           
          }
      );
  }

  CountTotalPrice(){
    this.TotalPrice = 0;
    for(let i of this.TicketsByEvent.tickets){
      
      this.TotalPrice+=i.price;
     
    }
  }


}

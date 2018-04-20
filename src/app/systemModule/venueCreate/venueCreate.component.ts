import { Component, ViewChild, ElementRef, NgZone, Input, ViewContainerRef, ComponentFactory } from '@angular/core';
import { NgForm,FormControl,FormGroup,Validators, FormArray} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { SelectModel } from '../../core/models/select.model';
import { FrontWorkingTimeModel } from '../../core/models/frontWorkingTime.model';
import { WorkingTimeModel } from '../../core/models/workingTime.model';
import { AccountCreateModel } from '../../core/models/accountCreate.model';
import { EventDateModel } from '../../core/models/eventDate.model';
import { ContactModel } from '../../core/models/contact.model';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { AccountType } from '../../core/base/base.enum';
import { GenreModel } from '../../core/models/genres.model';
import { EventCreateModel } from '../../core/models/eventCreate.model';

import { AccountService } from '../../core/services/account.service';
import { ImagesService } from '../../core/services/images.service';
import { TypeService } from '../../core/services/type.service';
import { GenresService } from '../../core/services/genres.service';
import { EventService } from '../../core/services/event.service';

import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { Router, Params,ActivatedRoute  } from '@angular/router';
import { AuthService } from "angular2-social-login";
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { AccountAddToEventModel } from '../../core/models/artistAddToEvent.model';
import { EventGetModel } from '../../core/models/eventGet.model';
import { AccountSearchModel } from '../../core/models/accountSearch.model';
import { Http } from '@angular/http';
import { Point } from '@agm/core/services/google-maps-types';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AgmCoreModule } from '@agm/core';
import { CheckModel } from '../../core/models/check.model';
import { TicketModel } from '../../core/models/ticket.model';
import { TicketGetParamsModel } from '../../core/models/ticketGetParams.model';
import { Observable } from 'rxjs/Observable';



declare var $:any;
declare var ionRangeSlider:any;

@Component({
  selector: 'venueCreate',
  templateUrl: './venueCreate.component.html',
  styleUrls: ['./venueCreate.component.css']
})




export class VenueCreateComponent extends BaseComponent implements OnInit 
{
  Venue:AccountCreateModel = new AccountCreateModel();
  VenueId:number = 0;

  aboutForm : FormGroup = new FormGroup({        
    "venue_name": new FormControl("", [Validators.required]),
    "mouse_name": new FormControl("", [Validators.required]),
    "short_desc": new FormControl("", [Validators.required]),
    "phone": new FormControl("", [Validators.required]),
    "fax": new FormControl("", []),
    "country": new FormControl("", [Validators.required]),
    "address": new FormControl("", [Validators.required]),
    "city": new FormControl("", [Validators.required]),
    "state": new FormControl("", [Validators.required]),
    "zipcode": new FormControl("", [Validators.required]),
  });

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

    ngOnInit()
    {
      this.activatedRoute.params.forEach((params) => {
        if(params["id"] == 'new')
        {;
          this.DisplayVenueParams(null);
        }
        else
        {
          this.accService.GetAccountById(params["id"],{extended:true})
            .subscribe
            (
              (res:AccountGetModel) => 
              {
                this.DisplayVenueParams(res);
              }
            );
        }
      });


    }

    DisplayVenueParams($venue?:AccountGetModel)
    {
      if($venue && $venue.id){
        this.VenueId = $venue.id;
        this.router.navigateByUrl("/system/venueCreate/"+this.VenueId);
      }
        
      this.Venue = $venue ? this.accService.AccountModelToCreateAccountModel($venue) : new AccountCreateModel();
      this.Venue.account_type = AccountType.Venue;
    }

    SaveVenue()
    {
      this.WaitBeforeLoading
      (
        () => this.VenueId == 0 ? this.accService.CreateAccount(this.Venue) : this.accService.UpdateMyAccount(this.VenueId,this.Venue),
        (res) => 
        {
          console.log(res);
          this.DisplayVenueParams(res);
        },
        (err) =>
        {
          console.log(err);
        }
      )
    }

  //   ServiceSaveVenue = (fun:()=>Observable<any>,success:(result?:any)=>void, err?:(obj?:any)=>void)=>{
  //     fun()
  //       .subscribe(
  //         res=>{
  //             success(res);
  //         },
  //         error=>{
  //           if(err && typeof err == "function"){
  //               err(error); 
  //           }
  //         }
  //       );
  // }
    
}

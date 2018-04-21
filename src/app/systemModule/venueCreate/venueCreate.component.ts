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
import { AccountType, VenueType } from '../../core/base/base.enum';
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
  Parts = PageParts;

  CurrentPart = this.Parts.About;

  Venue:AccountCreateModel = new AccountCreateModel();
  VenueId:number = 0;

  OfficeHours:FrontWorkingTimeModel[] = [];
  OfficeHoursSelectedDate = false;

  OperatingHours:FrontWorkingTimeModel[] = [];
  OperatingHoursSelectedDate = false;

  
  TypesOfSpace:SelectModel[] = [];
  LocatedTypes:SelectModel[] = [];

  ImageToLoad:string = '';

  VenueImages:string[] = [];

  EmailFormGroup : FormGroup = new FormGroup({
    "name_email":new FormControl("",[]),
    "email":new FormControl("",[Validators.email]),
  });

  aboutForm : FormGroup = new FormGroup({        
    "venue_name": new FormControl("", [Validators.required]),
    "mouse_name": new FormControl("", [Validators.required]),
    "short_desc": new FormControl("", [Validators.required]),
    "phone": new FormControl("", [Validators.required]),
    "fax": new FormControl("", []),
    "emails": new FormArray([
    ]),
    "country": new FormControl("", [Validators.required]),
    "address": new FormControl("", [Validators.required]),
    "city": new FormControl("", [Validators.required]),
    "state": new FormControl("", [Validators.required]),
    "zipcode": new FormControl("", [Validators.required]),
  });

  detailsForm : FormGroup = new FormGroup({
    "venue_type": new FormControl("", [Validators.required]),
    "capacity": new FormControl("",[Validators.required,
      Validators.pattern("[0-9]+"),
      Validators.min(0),Validators.max(150000)                                
    ]),
    "bathrooms": new FormControl("",[
      Validators.pattern("[0-9]+"),
      Validators.min(0),Validators.max(100)                                
    ]),
    "min_age": new FormControl("",[
      Validators.pattern("[0-9]+"),
      Validators.min(0),Validators.max(21)                                
    ]),
    "bar": new FormControl("",[]),
    "located":new FormControl("",[]),
    "dress_code":new FormControl("Shirt and Shoes Required",[])
  });

  mediaForm : FormGroup = new FormGroup({
    "vr": new FormControl("",[]),
    "audio_description" : new FormControl("",[Validators.required]),
    "lighting_description" : new FormControl("",[Validators.required]),
    "stage_description" : new FormControl("",[Validators.required])
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
      
      this.TypesOfSpace = this.typeService.GetAllSpaceTypes();
      this.LocatedTypes = this.typeService.GetAllLocatedTypes();
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
        setTimeout(()=> this.InitJs(),2500);
      });


    }

    InitJs()
    {
      // $('.slider-4-init').slick({
      //   dots: false,
      //   arrows: true,
      //   infinite: false,
      //   slidesToShow: 2,
      //     responsive: [
      //       {
      //         breakpoint: 1301,
      //         settings: {
      //           slidesToShow: 2,
      //           slidesToScroll: 2
               
      //         }
      //       }
      //     ]
      // });
    }

    DisplayVenueParams($venue?:AccountGetModel)
    {
      if($venue && $venue.id)
      {
        this.VenueId = $venue.id;
        this.router.navigateByUrl("/system/venueCreate/"+this.VenueId);
        this.GetVenueImages();
      }
      this.OfficeHours = ($venue && $venue.office_hours)?
                          this.accService.GetFrontWorkingTimeFromTimeModel($venue.office_hours):this.typeService.GetAllDays();
      this.OperatingHours = ($venue && $venue.operating_hours)?
                          this.accService.GetFrontWorkingTimeFromTimeModel($venue.operating_hours):this.typeService.GetAllDays();

      this.IsNeedToShowSelectDayWrapper();

      this.Venue = $venue ? this.accService.AccountModelToCreateAccountModel($venue) : new AccountCreateModel();
      this.Venue.account_type = AccountType.Venue;
      this.Venue.venue_type = VenueType.Public;

      this.aboutForm.controls["emails"] = new FormArray([]);

      if(!this.Venue.emails)
        this.Venue.emails = [new ContactModel()];
      
      this.addEmailsToForm(this.Venue.emails.length);
    }

    GetVenueImages()
    {
      this.imgService.GetAccountImages(this.VenueId,{limit:5})
        .subscribe(
          (res:any)=>{
            if(res && res.total_count > 0)
            {
              let index = 0;
              for(let id of res.images)
              {
                this.GetVenueImageById(id,index);
                index = index + 1;
              }
            }
          }
        );
    }

    GetVenueImageById(id,saveIndex)
    {
      this.imgService.GetImageById(id)
        .subscribe(
          (res:Base64ImageModel) =>{
            this.VenueImages[saveIndex] = res.base64;
          }
        );
    }

    SanitizeImage(image: string)
    {
      return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
    }

    SaveVenue()
    {
      this.Venue.office_hours = this.accService.GetWorkingTimeFromFront(this.OfficeHours);
      this.Venue.operating_hours = this.accService.GetWorkingTimeFromFront(this.OperatingHours);

      this.WaitBeforeLoading
      (
        () => this.VenueId == 0 ? this.accService.CreateAccount(this.Venue) : this.accService.UpdateMyAccount(this.VenueId,this.Venue),
        (res) => 
        {
          this.DisplayVenueParams(res);
          this.NextPart();
        },
        (err) =>
        {
          console.log(err);
        }
      )
    }

  NextPart()
  {
    if(this.CurrentPart == this.Parts.Dates)
      return;
    scrollTo(0,0);
    this.CurrentPart = this.CurrentPart + 1;
    // if(this.CurrentPart == this.Parts.Media)
    //   this.InitJs();
  }

  addEmailsToForm(count?:number){
    let n = 1;
    if(count)
      n = count;

    for(let i = 0; i < n; i++ )
    {
      (<FormArray>this.aboutForm.controls["emails"]).push(this.GetContactFormGroup());
    }
  }

  addEmail()
  {
    this.Venue.emails.push(new ContactModel());
    (<FormArray>this.aboutForm.controls["emails"]).push(this.GetContactFormGroup());
  }

  deleteEmail(index:number)
  {
    (<FormArray>this.aboutForm.controls["emails"]).removeAt(index);
    this.Venue.emails.splice(index,1);
  }

  GetContactFormGroup()
  {
    return new FormGroup({
      "name_email":new FormControl("",[]),
      "email":new FormControl("",[Validators.email]),
    })
  }

  OfficeHoursCheckChange(index, $event)
  {
    this.OfficeHours[index].checked = $event;

    this.IsNeedToShowSelectDayWrapper();
  }

  OperatingHoursCheckChange(index, $event)
  {
    this.OperatingHours[index].checked = $event;

    this.IsNeedToShowSelectDayWrapper();
  }

  IsNeedToShowSelectDayWrapper()
  {
    this.OperatingHoursSelectedDate = this.OperatingHours.filter(obj => obj.checked == true).length > 0;
    this.OfficeHoursSelectedDate = this.OfficeHours.filter(obj => obj.checked == true).length > 0;
  }

  getMask(item:WorkingTimeModel){
    return {
        mask: [/[0-2]/, item && item.begin_time && parseInt(item.begin_time.toString()) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
        keepCharPositions: true
      };
  } 
  getMaskEnd(item:WorkingTimeModel){
    
    return {
        mask: [/[0-2]/, item && item.end_time && parseInt(item.end_time.toString()) > 1 ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
        keepCharPositions: true
      };
  }
  loadImage($event:any):void{
    let target = $event.target;
    //let file:File = target.files[0];
    if(target.files.length == 0)
        return;
    
    for(let file of target.files)
    {
      let reader:FileReader = new FileReader();
      reader.onload = (e) =>{
          this.ImageToLoad = reader.result;
      }
      reader.readAsDataURL(file);
    }
  }
  DeleteImageFromLoading()
  {
    this.ImageToLoad = '';
  }

  AddVenuePhoto()
  {
    this.imgService.PostAccountImage(this.VenueId,this.ImageToLoad)
      .subscribe(
        (res:any) => {
          this.ImageToLoad = '';
          this.GetVenueImages();
        }
      );
  }

  ChangeCurrentPart(newPart)
  {
    if(this.VenueId == 0 && newPart > this.Parts.About)
      return;

    if(this.CurrentPart == newPart)
      return;
    
    // if(newPart == this.Parts.Media)
    //   this.InitJs();

    this.CurrentPart = newPart;
  }
    
}

export enum PageParts{
  About = 0,
  Hours = 1,
  Listing = 2,
  Media = 3,
  Dates = 4
};

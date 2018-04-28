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
import { VenueMediaPhotoModel } from '../../core/models/venueMediaPhoto.model';
import { MainService } from '../../core/services/main.service';
import { ImageAccModel, ImageAccModelAnswer } from '../../core/models/imageAcc.model';



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

  ImageToLoad:VenueMediaPhotoModel = new VenueMediaPhotoModel();

  VenueImages:ImageAccModel[] = [];

  ImageTypes: SelectModel[] = [];

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
    "zipcode": new FormControl("", []),
  });

  detailsForm : FormGroup = new FormGroup({
    "venue_type": new FormControl("", [Validators.required]),
    "other_venue": new FormControl("",[]),
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
    "audio_description" : new FormControl("",[Validators.required,
                                              Validators.maxLength(1000)]),
    "lighting_description" : new FormControl("",[Validators.required,
                                                Validators.maxLength(1000)]),
    "stage_description" : new FormControl("",[Validators.required,
                                              Validators.maxLength(1000)])
  }); 

  dateForm : FormGroup = new FormGroup(
    {
      "minimum_notice": new FormControl("",[Validators.pattern("[0-9]+"),
                              Validators.min(0),Validators.max(999)]),
      "is_flexible": new FormControl("",[]),
      "price_for_daytime": new FormControl("",[Validators.pattern("[0-9]+"),
                              Validators.min(0),Validators.max(1000000)]),
      "price_for_nighttime": new FormControl("",[Validators.pattern("[0-9]+"),
                              Validators.min(0),Validators.max(1000000)]),
      "performance_time_from": new FormControl("",[]),
      "performance_time_to": new FormControl("",[])
    }
  );

  slideConfig = {"slidesToShow": 2, "slidesToScroll": 2};

  @ViewChild('search') public searchElement: ElementRef;

  constructor
  (           
    protected main         : MainService,
    protected _sanitizer   : DomSanitizer,
    protected router       : Router,
    private mapsAPILoader  : MapsAPILoader,
    private ngZone         : NgZone,
    private activatedRoute : ActivatedRoute
  ){
    super(main,_sanitizer,router);
  } 

  ngOnInit()
  {
    this.CreateAutocomplete();
    this.TypesOfSpace = this.main.typeService.GetAllSpaceTypes();
    this.LocatedTypes = this.main.typeService.GetAllLocatedTypes();
    this.ImageTypes = this.main.typeService.GetAllSpaceTypes();
    this.activatedRoute.params.forEach(
      (params) => {
        if(params["id"] == 'new')
        {
          this.DisplayVenueParams(null);
        }
        else
        {
          this.WaitBeforeLoading(
            () => this.main.accService.GetAccountById(params["id"],{extended:true}),
            (res:AccountGetModel) => {
              this.DisplayVenueParams(res);
            }
          );
        }
      }
    );
  }

  CreateAutocomplete()
  {
    this.mapsAPILoader.load().then(
        () => {
          let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement);
          autocomplete.addListener(
            "place_changed",
            () => {
              this.ngZone.run(
                () => {
                  let place: google.maps.places.PlaceResult = autocomplete.getPlace();  
                  if(place.geometry === undefined || place.geometry === null )
                  {             
                    return;
                  }
                  else 
                  {
                    let addr:string[] = autocomplete.getPlace().adr_address.split(', ');
                        
                    for(let a of addr)
                    {
                      if(a.search('locality') > 0)
                      {
                        this.Venue.city = a.slice(a.search('>')+1,a.search('</'));
                      }
                      else if(a.search('street-address') > 0)
                      {
                        this.Venue.address = a.slice(a.search('>')+1,a.search('</'));
                      }
                      else if(a.search('region') > 0)
                      {
                        this.Venue.state = a.slice(a.search('>')+1,a.search('</'));
                      }
                      else if(a.search('country-name') > 0)
                      {
                        this.Venue.country = a.slice(a.search('>')+1,a.search('</'));
                      }
                      else if(a.search('postal-code') > 0)
                      {
                        this.Venue.zipcode = a.slice(a.search('>')+1,a.search('</'));
                      }
                    }   
                  }
                }
              );
            }
          );
        }
      );
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
                        this.main.accService.GetFrontWorkingTimeFromTimeModel($venue.office_hours):this.main.typeService.GetAllDays();
    this.OperatingHours = ($venue && $venue.operating_hours)?
                        this.main.accService.GetFrontWorkingTimeFromTimeModel($venue.operating_hours):this.main.typeService.GetAllDays();

    this.IsNeedToShowSelectDayWrapper();

    this.Venue = $venue ? this.main.accService.AccountModelToCreateAccountModel($venue) : new AccountCreateModel();
    this.Venue.account_type = AccountType.Venue;
    this.Venue.venue_type = VenueType.Public;

    this.aboutForm.controls["emails"] = new FormArray([]);

    if(!this.Venue.emails)
      this.Venue.emails = [new ContactModel()];
    
    this.addEmailsToForm(this.Venue.emails.length);
  }

  GetVenueImages()
  {
    this.WaitBeforeLoading(
      () => this.main.imagesService.GetAccountImages(this.VenueId,{limit:5}),
      (res:ImageAccModelAnswer) => {
        if(res && res.total_count > 0)
        {
          this.VenueImages = res.images;
        }
      }
    );
  }

  SaveVenue()
  {
    if(!this.CheckFormForValid())
    {
      console.log("Form invalid!");
      return;
    }
    this.Venue.office_hours = this.main.accService.GetWorkingTimeFromFront(this.OfficeHours);
    this.Venue.operating_hours = this.main.accService.GetWorkingTimeFromFront(this.OperatingHours);

    if(this.Venue.type_of_space != "other" && this.Venue.other_genre_description)
    {
      this.Venue.other_genre_description = "";
    }

    this.WaitBeforeLoading
    (
      () => this.VenueId == 0 ? this.main.accService.CreateAccount(this.Venue) : this.main.accService.UpdateMyAccount(this.VenueId,this.Venue),
      (res) => {
        this.DisplayVenueParams(res);
        this.NextPart();
      },
      (err) => {
        console.log(err);
      }
    )
  }

  CheckFormForValid()
  {
    switch(this.CurrentPart)
    {
      case this.Parts.About:{
        return !this.aboutForm.invalid;
      }
      case this.Parts.Listing:{
        return !this.detailsForm.invalid;
      }
      case this.Parts.Media:{
        return !this.mediaForm.invalid;
      }
      case this.Parts.Dates:{
        return !this.dateForm.invalid;
      }
      default:{
          return true;
      }
    } 
  }

  NextPart()
  {
    if(this.CurrentPart == this.Parts.Dates)
      this.router.navigate(["/system","profile",this.VenueId]);
      
    scrollTo(0,0);
    this.CurrentPart = this.CurrentPart + 1;
  }

  addEmailsToForm(count?:number)
  {
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

  GetFromTimeMask(item:FrontWorkingTimeModel){
    return {
      mask: [/[0-2]/, (item.start_work && (+item.start_work[0]) > 1) ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
      keepCharPositions: true
    };
  } 
  GetToTimeMask(item:FrontWorkingTimeModel){
    return {
      mask: this.main.typeService.GetEndTimeMask(item.start_work,item.finish_work),
      keepCharPositions: true
    };
  }

  GetPerformanceFromTimeMask(venue:AccountCreateModel)
  {
    return {
      mask: [/[0-2]/, (venue.performance_time_from && (+venue.performance_time_from[0]) > 1) ? /[0-3]/ : /\d/, ':', /[0-5]/, /\d/],
      keepCharPositions: true
    };
  }
  GetPerformanceToTimeMask(venue:AccountCreateModel)
  {
    return {
      mask: this.main.typeService.GetEndTimeMask(venue.performance_time_from,venue.performance_time_to),
      keepCharPositions: true
    };
  }

  GetCapacityMask(int:number)
  {
    let str = int?int.toString():"";
    
    let mask = [/[1-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,/[0-9]/];
    
    if( str && str.length > 4)
    {
      if(+str.substr(0,5) > 19999)
        mask.splice(5,1);
    }

    return {
      mask: mask,
      keepCharPositions: true,
      guide:false
    };
  }

  GetAgeMask(int:number)
  {
    let str = int?int.toString():"";
    let mask = [/[0-2]/,(str && +str[0] > 1)?/[0-5]/:/[0-9]/];
    
    if(str && +str[0] == 0)
      mask.splice(1,1);

    return {
      mask: mask,
      keepCharPositions: true,
      guide:false
    };
  }

  GetNumOfBathrooms(int:number)
  {
    let str = int?int.toString():"";
    let mask = [/[0-9]/,/[0-9]/];

    if(str && +str[0] == 0)
      mask.splice(1,1);

    return {
      mask: mask,
      keepCharPositions: true,
      guide:false
    };
  }
  GetMinimumNoticeMask()
  {
    return {
      mask: [/[1-9]/,/[0-9]/,/[0-9]/],
      keepCharPositions: true,
      guide:false
    };
  }

  GetPerfomancePriceMask()
  {
    return {
      mask: [/[1-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/,/[0-9]/],
      keepCharPositions: true,
      guide:false
    };
  }

  loadImage($event:any):void
  {
    let target = $event.target;
    if(target.files.length == 0)
        return;
    
    for(let file of target.files)
    {
      let reader:FileReader = new FileReader();
      reader.onload = (e) =>{
          this.ImageToLoad.image_base64 = reader.result;
      }
      reader.readAsDataURL(file);
    }
  }

  DeleteImageFromLoading()
  {
    this.ImageToLoad.image_base64 = '';
  }

  AddVenuePhoto()
  {
    if(this.ImageToLoad.image_type != "other" && this.ImageToLoad.image_type_description)
    {
      this.ImageToLoad.image_type_description = "";
    }

    this.WaitBeforeLoading(
      () => this.main.imagesService.PostAccountImage(this.VenueId,this.ImageToLoad),
      (res:any) => {
        this.ImageToLoad = new VenueMediaPhotoModel();
        this.ImageToLoad.image_description = "";
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

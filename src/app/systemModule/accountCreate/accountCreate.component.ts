import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgForm,FormControl} from '@angular/forms';
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
import { AccountService } from '../../core/services/account.service';
import { ImagesService } from '../../core/services/images.service';
import { TypeService } from '../../core/services/type.service';
import { GenresService } from '../../core/services/genres.service';
import { EventService } from '../../core/services/event.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'angular2-social-login';
import { MapsAPILoader } from '@agm/core';


@Component({
  selector: 'accountCreate',
  templateUrl: './accountCreate.component.html',
  styleUrls: ['./accountCreate.component.css']
})


export class AccountCreateComponent extends BaseComponent implements OnInit {
    Roles = AccountType;
    Genres:GenreModel[] = [];
    allGenres:GenreModel[] = [];
    genresShow:GenreModel[] = [];
    seeMore:boolean = false;
    VenueTypes:SelectModel[] = [];
    SelectedVenue:number = 1;
    hasBar:boolean = true;
    hasVr:boolean = true;
    AccountTypes:SelectModel[] = [];
    LocationTypes:SelectModel[] = [];
    BookingNotice:SelectModel[] = [];
    OfficeDays:FrontWorkingTimeModel[] = [];
    OperatingDays:FrontWorkingTimeModel[] = [];
    Days:FrontWorkingTimeModel[] = [];
    minDate: Date = new Date();
    date:Date;
    search:string = '';
    UserId:number;
    Account:AccountCreateModel = new AccountCreateModel();
    bsValue_start: Date[];
    bsValue_end: Date[];
    Error:string = '';
  
    @ViewChild('submitFormUsr') form: NgForm;
    @ViewChild('search') public searchElement: ElementRef;
    
    constructor(protected authService: AuthMainService,
      protected accService:AccountService,
      protected imgService:ImagesService,
      protected typeService:TypeService,
      protected genreService:GenresService,
      protected eventService:EventService,
      protected _sanitizer: DomSanitizer,
      protected router: Router,public _auth: AuthService,
      private mapsAPILoader: MapsAPILoader, 
      private activatedRoute: ActivatedRoute,
      private ngZone: NgZone){
  super(authService,accService,imgService,typeService,genreService,eventService,_sanitizer,router,_auth);
  }
  
    ngOnInit()
    {
      this.bsValue_start = [new Date()];
      this.bsValue_end = [new Date()];
      this.Account.dates = [new EventDateModel()];
      this.Account.emails = [new ContactModel()];
      this.Account.office_hours = [new WorkingTimeModel()];
      this.VenueTypes = this.typeService.GetAllVenueTypes();
      this.AccountTypes = this.typeService.GetAllAccountTypes();
      this.LocationTypes = this.typeService.GetAllLocationTypes();
      this.BookingNotice = this.typeService.GetAllBookingNotices();
      this.OfficeDays = this.Account.office_hours?this.accService.GetFrontWorkingTimeFromTimeModel(this.Account.office_hours):this.typeService.GetAllDays();
      this.OperatingDays = this.Account.operating_hours?this.accService.GetFrontWorkingTimeFromTimeModel(this.Account.operating_hours):this.typeService.GetAllDays();
      //this.Account.emails = [new ContactModel()];
      this.genreService.GetAllGenres()
        .subscribe((genres:string[])=> {
          this.Genres = this.genreService.GetGendreModelFromString(this.Account.genres, this.genreService.StringArrayToGanreModelArray(genres));
        });
      this.Account.account_type = this.Roles.Fan;
      this.CreateAutocomplete();
    }
   
  
    InitByUser(usr:any){  
      this.Account = this.accService.AccountModelToCreateAccountModel(usr);
      for(let i in this.Account.dates) {
        this.bsValue_start[i] = new Date(this.Account.dates[i].begin_date);
        this.bsValue_end[i] = new Date(this.Account.dates[i].end_date);
      }
      this.OfficeDays = usr.office_hours?this.accService.GetFrontWorkingTimeFromTimeModel(usr.office_hours):this.typeService.GetAllDays();
      this.OperatingDays = usr.operating_hours?this.accService.GetFrontWorkingTimeFromTimeModel(usr.operating_hours):this.typeService.GetAllDays();
      this.UserId = usr.id?usr.id:0;
      this.genreService.GetAllGenres()
        .subscribe((genres:string[])=> {
          this.Genres = this.genreService.GetGendreModelFromString(this.Account.genres, this.genreService.StringArrayToGanreModelArray(genres));
        });
      if(usr.image_id){
          this.imgService.GetImageById(usr.image_id)
              .subscribe((res:Base64ImageModel)=>{
                  this.Account.image_base64 = res.base64;
              });
      }

  }


  CreateUser(){
    if(this.form.valid){
      this.Account.office_hours = this.accService.GetWorkingTimeFromFront(this.OfficeDays);
      this.Account.operating_hours = this.accService.GetWorkingTimeFromFront(this.OperatingDays);
      this.Account.emails = this.typeService.ValidateArray(this.Account.emails);
      this.Account.genres = [];
      for(let g of this.Genres)
          if(g.checked) this.Account.genres.push(g.genre);
      for(let i in this.Account.dates){
        this.Account.dates[i].begin_date = this.bsValue_start[i].getFullYear()+`-`+this.incr(this.bsValue_start[i].getMonth())+`-`+this.bsValue_start[i].getDate();
        this.Account.dates[i].end_date = this.bsValue_end[i].getFullYear()+`-`+this.incr(this.bsValue_end[i].getMonth())+`-`+this.bsValue_end[i].getDate();
      }
      this.Account.venue_type = "public_venue";
      //this.Account.dates = this.typeService.ValidateArray(this.Account.dates);
      console.log("CR", this.Account);
      this.accService.CreateAccount(JSON.stringify(this.Account))
      .subscribe((res:any)=>{
          console.log("RES", res);
          this.InitByUser(res);
          this.isLoading = false;
          this.router.navigate(['/system','profile',res.id]);
          this.accService.onAuthChange$.next(true);
      },
      (err:any)=>{
        this.Error = err;       
      })
    }
  }

  Replace(key,value)
  {
    
    if(value !== null) {
        return value;
    }
  }

  CreateAutocomplete(){
    this.mapsAPILoader.load().then(
        () => {
           
         let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {types:[`(cities)`]});
        
          autocomplete.addListener("place_changed", () => {
           this.ngZone.run(() => {
           let place: google.maps.places.PlaceResult = autocomplete.getPlace();  
           if(place.geometry === undefined || place.geometry === null ){
            
            return;
           }
           else {
              this.Account.address = autocomplete.getPlace().formatted_address;
           }
          });
        });
      }
    );


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

  incr(n:number){
    return n+1;
  }
    AddEmail()
    {
      this.Account.emails.push(new ContactModel());
    }
  
    DeleteEmail(i:number)
    {
      this.Account.emails.splice(i,1);
    }
    AddVenueDate()
    {
      this.Account.dates.push(new EventDateModel());
      this.bsValue_start.push(new Date());
      this.bsValue_end.push(new Date());
    }
  
    DeleteVenueDate(i:number)
    {
      console.log("aa", i);
      console.log("aaa", this.bsValue_start);
      this.Account.dates.splice(i, 1);
      console.log("dates",this.Account.dates);
      this.bsValue_start.splice(i, 1);
      this.bsValue_end.splice(i, 1);
      console.log("aaa", this.bsValue_start);
    }
  
    AddVenueTime()
    {
      this.Account.office_hours.push(new WorkingTimeModel());
    }
  
    DeleteVenueTime(i:number)
    {
      this.Account.office_hours.splice(i,1);
    }
  
    loadLogo($event:any):void{
      let target = $event.target;
      let file:File = target.files[0];
      if(!file)
          return;
      let reader:FileReader = new FileReader();
      reader.onload = (e) =>{
          this.Account.image_base64 = reader.result;
      }
      reader.readAsDataURL(file);
  }

  
  seeFirstGenres(){
    for(let i in this.Genres) this.Genres[i].show = +i < 4;
    /*this.Genres[0].show = true;
    this.Genres[1].show = true;
    this.Genres[2].show = true;
    this.Genres[3].show = true;*/
    this.seeMore = false;
  }

  seeMoreGenres(){
    this.seeMore = true;
    // let checked = this.genres;
    // this.genres = this.genreService.GetAll(checked);
    for(let g of this.Genres) g.show = true;
  }

CategoryChanged($event:string){
   this.search = $event;
    if(this.search.length>0) {
      for(let g of this.Genres)
         if(g.genre_show.indexOf(this.search.toUpperCase())>=0)
          g.show = true;
         else
          g.show = false;
    }
    else {
      this.seeFirstGenres();
    }
}

  logChanged($event){
    console.log("event",$event);
  }



  MaskTelephone(){
    return {
      // mask: ['+',/[1-9]/,' (', /[1-9]/, /\d/, /\d/, ') ',/\d/, /\d/, /\d/, '-', /\d/, /\d/,'-', /\d/, /\d/],
      mask: ['+',/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/],
      keepCharPositions: true,
      guide:false
    };
  }
}

import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';
import { AuthService } from "angular2-social-login";
import { BaseComponent } from '../../core/base/base.component';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { AccountSearchParams } from '../../core/models/accountSearchParams.model';
import { SelectModel } from '../../core/models/select.model';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { AccountType } from '../../core/base/base.enum';
import { MapsAPILoader } from '@agm/core';
import { AccountService } from '../../core/services/account.service';
import { ImagesService } from '../../core/services/images.service';
import { TypeService } from '../../core/services/type.service';
import { GenresService } from '../../core/services/genres.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { EventService } from '../../core/services/event.service';

declare var $:any;

@Component({
  selector: 'shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.css']
})


export class ShowsComponent extends BaseComponent implements OnInit {
  MIN_PRICE:number = 0;
  MAX_PRICE:number = 100000;
  MIN_CAPACITY:number = 0;
  MAX_CAPACITY:number = 70000;
  Roles = AccountType;
  SearchParams: AccountSearchParams = new AccountSearchParams();
  AccountTypes:SelectModel[] = [];
  Accounts:AccountGetModel[] = [];
  Images:string[] = [];
  place: string='';


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
    private ngZone: NgZone){
super(authService,accService,imgService,typeService,genreService,eventService,_sanitizer,router,_auth);
}

  ngOnInit(){

    $(".nav-button").on("click", function (e) {
      e.preventDefault();
      $("body").addClass("has-active-menu");
      $(".mainWrapper").addClass("has-push-left");
      $(".nav-holder-3").addClass("is-active");
      $(".mask-nav-3").addClass("is-active")
    });
    $(".menu-close, .mask-nav-3").on("click", function (e) {
        e.preventDefault();
        $("body").removeClass("has-active-menu");
        $(".mainWrapper").removeClass("has-push-left");
        $(".nav-holder-3").removeClass("is-active");
        $(".mask-nav-3").removeClass("is-active");
    });
    let _that = this;
    var price_slider = $(".price-slider").ionRangeSlider({
      type:"double",
      min: this.MIN_PRICE,
      max: this.MAX_PRICE,
      from: 0,
      hide_min_max: false,
      prefix: "$ ",
      grid: false,
      prettify_enabled: true,
      prettify_separator: ',',
      grid_num: 5,
      onChange: function(data)
      {
        _that.PriceChanged(data);
      }
  });
  var capacity_slider = $(".capacity-slider").ionRangeSlider({
    type:"double",
    min: this.MIN_CAPACITY,
    max: this.MAX_CAPACITY,
    from: 0,
    hide_min_max: false,
    prefix: "",
    grid: false,
    prettify_enabled: true,
    prettify_separator: ',',
    grid_num: 5,
    onChange: function(data)
    {
      _that.CapacityChanged(data);
    }
});

    this.AccountTypes = this.typeService.GetAllAccountTypes();
    this.GetAccounts();

    this.CreateAutocomplete();
  }

  GetAccounts()
  {
    this.ParseSearchParams();
    this.accService.AccountsSearch(this.SearchParams)
    .subscribe((res:AccountGetModel[])=>{
      this.Accounts = res;
      console.log(this.Accounts);
    })
  }

  ShowSearchResults() {
    this.GetAccounts();
    $("body").removeClass("has-active-menu");
    $(".mainWrapper").removeClass("has-push-left");
    $(".nav-holder-3").removeClass("is-active");
    $(".mask-nav-3").removeClass("is-active")

  }

  GetImages()
  {
    this.Images = [];
    for(let item of this.Accounts)
    {
      this.Images[item.id] = "";
      if(item.image_id)
      {
        this.imgService.GetImageById(item.image_id)
          .subscribe((res:Base64ImageModel)=>{
            this.Images[item.id] = res.base64;
          })
      }
    }

  }

  PriceChanged(data:any)
  {
    if(data.from && this.SearchParams.price_from != data.from)
      this.SearchParams.price_from = data.from;
    if(data.to && this.SearchParams.price_to != data.to)  
      this.SearchParams.price_to = data.to;
  }

  CapacityChanged(data:any)
  {
    if(data.from && this.SearchParams.capacity_from != data.from)
      this.SearchParams.capacity_from = data.from;
    if(data.from && this.SearchParams.capacity_to != data.from)
      this.SearchParams.capacity_to = data.to;
  }

  ParseSearchParams()
  {
    if(this.SearchParams.type)
    {
      let search:AccountSearchParams = new AccountSearchParams();
      search.limit = this.SearchParams.limit;
      search.offset = this.SearchParams.offset;
      if(this.SearchParams.text)
          search.text = this.SearchParams.text;
      if(this.SearchParams.genres)
        search.genres = this.SearchParams.genres;

      if(this.SearchParams.type != this.Roles.Fan)
      {
        if(this.SearchParams.price_from)
          search.price_from = this.SearchParams.price_from;
        
        if(this.SearchParams.price_to)
          search.price_to = this.SearchParams.price_to;
      }

      if(this.SearchParams.type == this.Roles.Venue)
      {
        if(this.SearchParams.address)
          search.address = this.SearchParams.address;

        if(this.SearchParams.capacity_from)
          search.capacity_from = this.SearchParams.capacity_from;

        if(this.SearchParams.capacity_to)
          search.capacity_to = this.SearchParams.capacity_to;

        if(this.SearchParams.type_of_space)
          search.type_of_space = this.SearchParams.type_of_space;
      }
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
              this.SearchParams.address = autocomplete.getPlace().formatted_address;
           }
          });
        });
      }
    );


  }
  
}

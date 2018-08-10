import { Component, OnInit, NgZone, ViewChild, ElementRef, ChangeDetectorRef, AfterViewChecked, HostListener } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { GenreModel } from '../../core/models/genres.model';
import { AccountCreateModel } from '../../core/models/accountCreate.model';
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
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountType, BaseMessages } from '../../core/base/base.enum';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { MainService } from '../../core/services/main.service';
import { ErrorComponent } from '../../shared/error/error.component';

declare var $:any;

@Component({
  selector: 'app-fan-create',
  templateUrl: './fan-create.component.html',
  styleUrls: ['./fan-create.component.css']
})
export class FanCreateComponent extends BaseComponent implements OnInit,AfterViewChecked {
  Fun:AccountCreateModel = new AccountCreateModel();
  FunId:number = 0;
  search:string = '';
  Genres:GenreModel[] = [];
  allGenres:GenreModel[] = [];
  seeMore:boolean = false;
  flagForText:boolean;
  cordsMap = {lat:55.755826, lng:37.6172999};
  avatar:string = '';
  ImageId:number = 0;
  @ViewChild('errorCmp') errorCmp: ErrorComponent;
  @ViewChild('submitFormFun') form: FormGroup;
  @ViewChild('search') public searchElement: ElementRef;

  // aboutForm : FormGroup = new FormGroup({
  //   "user_name": new FormControl("", [Validators.required]),
  //   "first_name": new FormControl("", [Validators.required]),
  //   "last_name": new FormControl(""),
  //   "bio": new FormControl("")
  // });

  isShowMap = false;

  ESCAPE_KEYCODE = 27;
  ENTER_KEYCODE = 13;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
      if(this.isShowMap){
          if (event.keyCode === this.ESCAPE_KEYCODE || event.keyCode === this.ENTER_KEYCODE) {
            $('#modal-map-2').modal('hide');
            this.isShowMap = false;
          }
      }
  }
  
  constructor(
    protected main           : MainService,
    protected _sanitizer     : DomSanitizer,
    protected router         : Router,
    protected mapsAPILoader  : MapsAPILoader,
    protected ngZone         : NgZone,
    protected activatedRoute : ActivatedRoute,
    protected cdRef          : ChangeDetectorRef
  ) {
    super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute);
  }

  ngAfterViewChecked()
  {
      this.cdRef.detectChanges();
  }

  ngOnInit()
  {
    this.activatedRoute.params.forEach(
      (params) => {
        if(params["id"] == 'new')
        {
          this.avatar = "";
          this.flagForText = true;
          this.DisplayFunParams(null);
        }
        else
        {
          this.WaitBeforeLoading(
            () => this.main.accService.GetAccountById(params["id"],{extended:true}),
            (res:AccountGetModel) =>
            {
              this.flagForText = false;
              this.DisplayFunParams(res);
              if(res.image_id){
                this.WaitBeforeLoading(
                  () => this.main.imagesService.GetImageById(res.image_id),
                  (result:Base64ImageModel) =>{
                    this.avatar = result.base64;
                    this.ImageId = res.image_id;
                    this.Fun.image_base64 = this.avatar;
                  }
                );
              }
              else{

              }
            }
          );
        }
      }
    );
    this.CreateAutocomplete();
  }
    DeleteAva(){
      if(this.ImageId && this.avatar){
        this.main.imagesService.DeleteImageById(this.ImageId,this.FunId).subscribe(
          (res)=>{
            this.Fun.image_base64 = '';
            this.errorCmp.OpenWindow(BaseMessages.Success);
            this.LocalDeleteAva();
          },
          (err)=>{
            this.errorCmp.OpenWindow(this.getResponseErrorMessage(err, 'fan'));
          }
        );
      }
      else{
        this.LocalDeleteAva();
      }
    }
    LocalDeleteAva(){
      this.avatar ='';
    }
  CreateAutocomplete()
  {
    this.mapsAPILoader.load().then(
      () => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {types:[`(cities)`]});

        autocomplete.addListener("place_changed",
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
                    // this.venueSearchParams.address = autocomplete.getPlace().formatted_address;
                    // this.venueSearch();
                    // this.mapCoords.venue.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                    // this.mapCoords.venue.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                    this.Fun.address = autocomplete.getPlace().formatted_address;
                    this.cordsMap.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                    this.cordsMap.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                    this.Fun.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                    this.Fun.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                  }
                }
              );
            }
          );
        }
      );
  }

  artistDragMarker($event)
  {
    this.cordsMap.lat = $event.coords.lat;
    this.cordsMap.lng = $event.coords.lng;
    this.Fun.lat = $event.coords.lat;
    this.Fun.lng = $event.coords.lng;
    this.codeLatLng( this.cordsMap.lat, this.cordsMap.lng);
  }

  codeLatLng(lat, lng)
  {
    let geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode(
      {'location': latlng },
      (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            this.Fun.address = results[1].formatted_address;
          }
        }
      }
    );
  }

  loadLogo($event:any):void
  {
    this.ReadImages(
        $event.target.files,
        (res:string)=>{
            this.Fun.image_base64 = res;
            this.avatar = res;
        }
      );
  }

  DisplayFunParams($Fun?:AccountGetModel)
  {
    if($Fun && $Fun.id)
    {
      this.FunId = $Fun.id;
      this.router.navigateByUrl("/system/fanCreate/"+this.FunId);
    }
    else{ this.FunId = 0}
    this.Fun = $Fun ? this.main.accService.AccountModelToCreateAccountModel($Fun) : new AccountCreateModel();
    // this.Venue.account_type = AccountType.Venue;
    // this.Venue.venue_type = VenueType.Public;

    this.WaitBeforeLoading(
      () => this.main.genreService.GetAllGenres(),
      (genres:string[])=> {
        console.log(genres);
        this.Genres = this.main.genreService.StringArrayToGenreModelArray(genres);
        if(this.Fun&&this.Fun.genres){
          for(let g of this.Fun.genres){
            for(let gnr of this.Genres)
              if(gnr.genre === g) gnr.checked = true;
          }
        }
        this.seeFirstGenres();
      }
    );

    if(this.Fun.lat&&this.Fun.lng)
    {
      this.cordsMap.lat = this.Fun.lat;
      this.cordsMap.lng = this.Fun.lng;
    }
  }

  seeFirstGenres()
  {
    let count = 0;

    for(let g of this.Genres){
      if(g.checked && count < 4){
        count++;
        g.show = true;
      }
    }
    
    for(let g of this.Genres){
      if(count < 4){
        if(!g.checked){
          count++;
          g.show = true;
        }
      }
      else{
        break;
      }
    }

    // for(let i in this.Genres){
    //   this.Genres[i].show = +i < 4;
    // }
    /*this.Genres[0].show = true;
    this.Genres[1].show = true;
    this.Genres[2].show = true;
    this.Genres[3].show = true;*/
    this.seeMore = false;
  }


  CategoryChanged($event:string)
  {
    this.search = $event;
    if(this.search.length>0)
    {
      for(let g of this.Genres)
      {
        if(g.genre_show.indexOf(this.search.toLowerCase())>=0)
        {
          g.show = true;
        }
        else
        {
          g.show = false;
        }
      }
     }
     else
     {
       this.seeFirstGenres();
     }
 }

  seeMoreGenres()
  {
    this.seeMore = true;
    // let checked = this.genres;
    // this.genres = this.genreService.GetAll(checked);
    for(let g of this.Genres) g.show = true;
  }

  CreateFun(){
    if(this.form.valid)
    {
      this.Fun.account_type = AccountType.Fan;
      this.Fun.genres = [];

     // this.Fun.genres = this.main.genreService.GenreModelArrToStringArr(this.Genres);
      this.Fun.genres = [];

      for(let g of this.Genres){
        if(g.checked){
          this.Fun.genres.push(g.genre);
        }
      }

     
      this.WaitBeforeLoading(
        ()=> this.FunId == 0 ? this.main.accService.CreateAccount(this.Fun) : this.main.accService.UpdateMyAccount(this.FunId,this.Fun),
        (res:any)=>{
          // this.DisplayFunParams(res);
          if(this.Fun.lat&&this.Fun.lng)
            {
              this.cordsMap.lat = this.Fun.lat;
              this.cordsMap.lng = this.Fun.lng;
            }
          this.main.GetMyAccounts(
            () => {
              this.main.CurrentAccountChange.next(res);       
              this.router.navigate(['/system','profile',res.id]);
            }
          );
          
        },
        (err:any)=>{
      
          this.errorCmp.OpenWindow(this.getResponseErrorMessage(err, 'fan'));
        }
      );
    }
    else {
      this.errorCmp.OpenWindow(this.getFormErrorMessage(this.form, 'fan'));
    }
  }

  OpenMap()
  {
    $('#modal-map-2').modal('show');
    this.isShowMap = true;
  }




}

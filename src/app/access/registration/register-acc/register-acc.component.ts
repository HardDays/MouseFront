import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, NgZone, HostListener  } from '@angular/core';
import { UserGetModel } from '../../../core/models/userGet.model';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import { GenreModel } from '../../../core/models/genres.model';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';
import { BaseComponent } from '../../../core/base/base.component';


import { NgForm} from '@angular/forms';

import { Router, Params } from '@angular/router';
import { AuthService } from "angular2-social-login";

import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

// import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { Http } from '@angular/http';
import { AccountService } from '../../../core/services/account.service';
import { ImagesService } from '../../../core/services/images.service';
import { GenresService } from '../../../core/services/genres.service';
import { AuthMainService } from '../../../core/services/auth.service';
import { TypeService } from '../../../core/services/type.service';
import { EventService } from '../../../core/services/event.service';
import { MainService } from '../../../core/services/main.service';
import { ErrorComponent } from '../../../shared/error/error.component';
import { BaseMessages } from '../../../core/base/base.enum';

declare var $:any;

@Component({
  selector: 'app-register-acc',
  templateUrl: './register-acc.component.html',
  styleUrls: ['./register-acc.component.css']
})
export class RegisterAccComponent extends BaseComponent implements OnInit {


  @Input() typeUser:string;
  @Output() back = new EventEmitter<string>();
  @Output() createStatus = new EventEmitter<boolean>();
  @ViewChild('search') public searchElementFrom: ElementRef;

  @ViewChild('errorCmp') errorCmp: ErrorComponent;


  accForm : FormGroup = new FormGroup({
    "user_name": new FormControl("", [Validators.required]),
    "first_name": new FormControl("", [Validators.required]),
    "last_name": new FormControl("", [Validators.required])
  });

  genres:GenreModel[] = [];
  genresShow:GenreModel[] = [];
  allGenres:GenreModel[] = [];
  search:string = '';
  seeMore:boolean = false;
  Account:AccountCreateModel = new AccountCreateModel();
  place: string='';

  Error:string = '';
  mapCoords =  {lat:55.755826, lng:37.6172999};

  isShowMap = false;

  ESCAPE_KEYCODE = 27;
  ENTER_KEYCODE = 13;

  isCreate = false;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
      if(this.isShowMap){
          if (event.keyCode === this.ESCAPE_KEYCODE || event.keyCode === this.ENTER_KEYCODE) {
            $('#modal-map-reg').modal('hide');
            this.isShowMap = false;
          }
      }
  }

  ngOnInit()
  {
    this.CreateAutocomplete();
    this.WaitBeforeLoading(
      () => this.main.genreService.GetAllGenres(),
      (res:string[]) =>
      {
        this.genres = this.main.genreService.StringArrayToGenreModelArray(res);
        this.seeFirstGenres();
      }
    );
  }
  openMap(){
    $('#modal-map-reg').modal(`show`);
    this.isShowMap = true;
  }
  CreateAutocomplete()
  {
    this.mapsAPILoader.load().then
    (
       () =>
       {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementFrom.nativeElement, {types:[`(cities)`]});

        autocomplete.addListener(
          "place_changed",
          () =>
          {
            this.ngZone.run(
              () =>
              {
                  let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                  if(place.geometry === undefined || place.geometry === null )
                  {
                    return;
                  }
                  else
                  {
                    this.Account.address = autocomplete.getPlace().formatted_address;
                    // this.Params.public_lat=autocomplete.getPlace().geometry.location.toJSON().lat;
                    // this.Params.public_lng=autocomplete.getPlace().geometry.location.toJSON().lng;
                    this.mapCoords.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                    this.mapCoords.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                    // this.Params.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
                    // this.Params.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
                  }
                }
              );
          }
        );
      }
    );
  }

  backTo()
  {
    this.main.authService.DeleteMyUser();
    this.back.emit('user');
  }

  loadLogo($event:any):void
  {
    this.ReadImages(
        $event.target.files,
        (res:string)=>
        {
            this.Account.image_base64 = res;
        }
    );
  }

  seeFirstGenres()
  {
    for(let g of this.genres) g.show = false;

    this.genres[0].show = true;
    this.genres[1].show = true;
    this.genres[2].show = true;
    this.genres[3].show = true;

    this.seeMore = false;
  }

  seeMoreGenres()
  {
    this.seeMore = true;
    for(let g of this.genres)
      g.show = true;
  }


  CategoryChanged($event:string)
  {
    this.search = $event;
    if(this.search.length>0)
    {
      this.seeMore = true;
      for(let g of this.genres)
      {
         if(g.genre_show.indexOf(this.search.toUpperCase())>=0)
          g.show = true;
         else
          g.show = false;
      }
    }
    else
    {
      this.seeFirstGenres();
    }
  }

  registerAcc()
  {
    if(!this.isCreate){
      this.isCreate = true;
      if(this.accForm.invalid)
      {
        this.errorCmp.OpenWindow(this.getFormErrorMessage(this.accForm, 'base'));
        return;
      }

      //this.Account.genres = this.main.genreService.GenreModelArrToStringArr(this.genres);

      this.Account.genres = [];

      for(let g of this.genres){
        if(g.checked){
          this.Account.genres.push(g.genre);
        }
      }
      console.log(this.genres);
      console.log(this.Account.genres);
      this.Account.account_type = this.typeUser;
      this.Account.user_name = this.accForm.value['user_name'];
      this.Account.display_name = this.accForm.value['first_name']+" "+this.accForm.value['last_name'];
      this.Account.first_name = this.accForm.value['first_name'];
      this.Account.last_name = this.accForm.value['last_name'];
      this.WaitBeforeLoading(
        ()=>this.main.accService.CreateAccount(this.Account),
        (res)=>{
          this.isCreate = false;
          this.createStatus.emit(true);
          this.main.SetCurrentAccId(res.id);
        },
        (err)=>{
          this.errorCmp.OpenWindow(this.getResponseErrorMessage(err));
          setTimeout(() => {
            this.isCreate = false;
            if(this.errorCmp.isShown)
              this.errorCmp.CloseWindow();
          }, 3500);
        }
      )
  }
  
  }



  dragMarker($event)
  {
      this.mapCoords.lat = $event.coords.lat;
      this.mapCoords.lng = $event.coords.lng;
      this.Account.lat = $event.coords.lat;
      this.Account.lng = $event.coords.lng;
      this.codeLatLng( this.mapCoords.lat, this.mapCoords.lng);
  }

  setMapCoords(event){
      this.mapCoords = {lat:event.coords.lat,lng:event.coords.lng};
      this.Account.lng = event.coords.lat;
      this.Account.lng = event.coords.lng;
      this.codeLatLng( this.mapCoords.lat, this.mapCoords.lng);

  }

  codeLatLng(lat, lng) {
      let geocoder = new google.maps.Geocoder();
      let latlng = new google.maps.LatLng(lat, lng);
      geocoder.geocode(
          {'location': latlng },
          (results, status) => {
              if (status === google.maps.GeocoderStatus.OK) {
                  if (results[1]) {

                      $("#address").val(results[1].formatted_address);
                      this.Account.address = results[1].formatted_address;
                  }
                  else {
                  // alert('No results found');
                  }
              }
              else {
                  // alert('Geocoder failed due to: ' + status);
              }
          }
      );

  }
}

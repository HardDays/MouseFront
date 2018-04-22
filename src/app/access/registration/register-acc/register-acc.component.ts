import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, NgZone  } from '@angular/core';
import { UserGetModel } from '../../../core/models/userGet.model';
import { FormGroup, FormControl } from '@angular/forms';
import { GenreModel } from '../../../core/models/genres.model';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';
import { BaseComponent } from '../../../core/base/base.component';


import { NgForm} from '@angular/forms';

import { Router, Params } from '@angular/router';
import { AuthService } from "angular2-social-login";

import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { Http } from '@angular/http';
import { AccountService } from '../../../core/services/account.service';
import { ImagesService } from '../../../core/services/images.service';
import { GenresService } from '../../../core/services/genres.service';
import { AuthMainService } from '../../../core/services/auth.service';
import { TypeService } from '../../../core/services/type.service';
import { EventService } from '../../../core/services/event.service';

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

  accForm : FormGroup = new FormGroup({        
    "user_name": new FormControl("",),
    "first_name": new FormControl("",),
    "last_name": new FormControl("")
  });

  genres:GenreModel[] = [];
  genresShow:GenreModel[] = [];
  allGenres:GenreModel[] = [];
  search:string = '';
  seeMore:boolean = false;
  Account:AccountCreateModel = new AccountCreateModel(); 
  place: string='';
 
  Error:string = '';
  
  constructor(protected authService: AuthMainService,
    protected accService:AccountService,
    protected imgService:ImagesService,
    protected typeService:TypeService,
    protected genreService:GenresService,
    protected eventService:EventService,
    protected _sanitizer: DomSanitizer,
    protected router: Router,public _auth: AuthService,
    private mapsAPILoader: MapsAPILoader, protected h:Http,
    private ngZone: NgZone){
super(authService,accService,imgService,typeService,genreService,eventService,_sanitizer,router,h,_auth);
} 

  ngOnInit(){
      
    this.genreService.GetAllGenres()
     .subscribe((res:string[])=>{
      //  console.log(res);
       this.genres = this.genreService.StringArrayToGanreModelArray(res);     
       this.seeFirstGenres(); 
     });
         
  this.CreateAutocomplete();
 }

 CreateAutocomplete(){
   this.mapsAPILoader.load().then(
       () => {
          
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementFrom.nativeElement, {types:[`(cities)`]});
       
         autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();  
          if(place.geometry === undefined || place.geometry === null ){
           
           return;
          }
          else {
             this.Account.address = autocomplete.getPlace().formatted_address;
            
          // this.Params.public_lat=autocomplete.getPlace().geometry.location.toJSON().lat;
          // this.Params.public_lng=autocomplete.getPlace().geometry.location.toJSON().lng;
          // this.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
           //this.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
         //  this.Params.lat = autocomplete.getPlace().geometry.location.toJSON().lat;
         //  this.Params.lng = autocomplete.getPlace().geometry.location.toJSON().lng;
          }
         });
         });
       }
          );


 }

  backTo(){
    this.back.emit('phone');
  }

  loadLogo($event:any):void{
    this.ReadImages(
        $event.target.files,
        (res:string)=>{
            this.Account.image_base64 = res;
            
        }
    );
  }

  seeFirstGenres(){
    for(let g of this.genres) g.show = false;
    this.genres[0].show = true;
    this.genres[1].show = true;
    this.genres[2].show = true;
    this.genres[3].show = true;
    this.seeMore = false;
  }

  seeMoreGenres(){
    this.seeMore = true;
    for(let g of this.genres) g.show = true;
  }


  CategoryChanged($event:string){
   this.search = $event;
    if(this.search.length>0) {
      for(let g of this.genres)
         if(g.genre_show.indexOf(this.search.toUpperCase())>=0)
          g.show = true;
         else
          g.show = false;
    }
    else {
      this.seeFirstGenres();
    }
  }


  registerAcc(){

      this.Account.genres = [];
      for(let g of this.genres)
        if(g.checked) this.Account.genres.push(g.genre);
      this.Account.account_type = this.typeUser;
    this.Account.user_name = this.accForm.value['user_name'];
    this.Account.display_name = this.accForm.value['first_name']+" "+this.accForm.value['last_name'];

    // console.log(this.Account);
        this.CreateAcc(this.Account,(res)=>{
          //console.log(`ok`);
          this.createStatus.emit(true);
        },
          (err)=>{
              console.log(err);
              this.Error = err._body;
    });

   
    
  }

}

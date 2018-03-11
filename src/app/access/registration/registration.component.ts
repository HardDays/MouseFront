import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';
import { AccountService } from '../../core/services/account.service';
import { ImagesService } from '../../core/services/images.service';
import { TypeService } from '../../core/services/type.service';
import { GenresService } from '../../core/services/genres.service';
import { Router, Params } from '@angular/router';
import { AuthService } from "angular2-social-login";

import { BaseComponent } from '../../core/base/base.component';

import { AccountCreateModel } from '../../core/models/accountCreate.model';
import { UserCreateModel } from '../../core/models/userCreate.model';
import { GenreModel } from '../../core/models/genres.model';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { EventService } from '../../core/services/event.service';


declare var $:any;


@Component({
  selector: 'register',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})


export class RegistrationComponent extends BaseComponent implements OnInit {

  Error:string = '';
  genres:GenreModel[] = [];
  genresShow:GenreModel[] = [];
  allGenres:GenreModel[] = [];
  search:string = '';
  artists:AccountGetModel[] = [];
  followsId:number[] = [];
  artistsChecked:boolean[]=[];
  seeMore:boolean = false;
  firstPage:boolean = true;
  Account:AccountCreateModel = new AccountCreateModel();
  User:UserCreateModel = new UserCreateModel();
  place: string='';
  createAccSucc:boolean = true;

  @ViewChild('search') public searchElementFrom: ElementRef;

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
      
     this.genreService.GetAllGenres()
      .subscribe((res:string[])=>{
        this.genres = this.genreService.StringArrayToGanreModelArray(res);
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



  registerUserAcc(){
    if(!this.User.email||!this.User.password)
      this.Error = 'Entry fields email and password!';
    else if (this.User.password.length<6)
      this.Error = 'Short password!';
    else if (this.User.email.search('@')<=0)
      this.Error = 'Uncorrect email!';
    else {

      this.Account.account_type = 'fan';
      this.createAccSucc = true;

      this.Account.genres = [];
      for(let g of this.genres)
        if(g.checked) this.Account.genres.push(g.genre);

      
      
      // this.CreateUserAcc(this.User,this.Account,(err)=>{
      //       this.firstPage = true;   
      //       this.createAccSucc = false;    
      //       if(err.status==422) this.Error = err._body;
      // });

      
      // if(!this.userCreated)
        this.CreateUserAcc(this.User,this.Account,(err)=>{
                this.firstPage = true;   
                this.createAccSucc = false;    
                if(err.status==422) this.Error = err._body;
        });
      // this.CreateAcc(this.Account,(err)=>{  
      //         this.createAccSucc = false;    
      //         if(err.status==422) this.Error = err._body;
      // });

      this.getArtists();
    }

  }

  getArtists(){
    this.genreService.GetArtists(this.genres).
    subscribe((res:AccountGetModel[])=>{
  
    this.artists = res;
    
    for(let i=0;i<this.artists.length;i++)
      this.artistsChecked.push(false);

      if (this.createAccSucc) {
        this.firstPage = false;

      }
      
    });
  }

  followArtists(){
    for(let i=0;i<this.artistsChecked.length;i++)
      if(this.artistsChecked[i]) this.followsId.push(this.artists[i].id);
             
    let id:number = this.accId;
    for(let follow of this.followsId){
        this.accService.AccountFollow(id,follow).subscribe(()=>{
        });
    }
    
    this.router.navigate(['/system','shows']);

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

  MaskTelephone(){
    return {
      // mask: ['+',/[1-9]/,' (', /[1-9]/, /\d/, /\d/, ') ',/\d/, /\d/, /\d/, '-', /\d/, /\d/,'-', /\d/, /\d/],
      mask: ['+',/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/],
      keepCharPositions: true,
      guide:false
    };
  }

  clickItem(index:number){
    console.log(index);
     var ch = "#checkbox-"+index+"-"+index;
     $(ch).addClass('scaled');

    setTimeout(()=>{
      $(ch).removeClass('scaled');
    },120)
  }

}

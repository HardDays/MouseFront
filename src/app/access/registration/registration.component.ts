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
// import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { EventService } from '../../core/services/event.service';
import { Http } from '@angular/http';
import { MainService } from '../../core/services/main.service';
import { PreloaderComponent } from '../../shared/preloader/preloader.component'

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

  @ViewChild('submitFormUsr') form: NgForm;
  @ViewChild('search') public searchElementFrom: ElementRef;

  typeUser:string;

  currentPage:string = 'phone';

  phone:string;
  isShowPhone:boolean = true;
    
  onSuccesCreateUser(type:string){
    if(type){
      this.currentPage = 'acc';
       this.typeUser = type;
      }
  }
  onSuccesCreateAcc(status:boolean){
   
    if(status){
      this.currentPage = 'follow';
      
    }
  }
  onSuccesValidatePhone(res:{status:boolean,phone:string}){
    if(res.status){
      this.currentPage = 'user';
      this.phone = res.phone;
    }
  }

  backToPage(s:string){
    this.currentPage = s;
  }


  ngOnInit(){
    
  }

  showPhone(status:boolean){
    this.isShowPhone = status;
    this.currentPage = 'user';
  }


}

export enum Pages {
  phone = 0,
  user = 1,
  acc = 2,
  follow = 3
}

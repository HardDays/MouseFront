
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';
import { AccountService } from '../../core/services/account.service';
import { ImagesService } from '../../core/services/images.service';
import { TypeService } from '../../core/services/type.service';
import { GenresService } from '../../core/services/genres.service';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { AuthService } from "angular2-social-login";

import { BaseComponent } from '../../core/base/base.component';

import { AccountCreateModel } from '../../core/models/accountCreate.model';
import { UserCreateModel } from '../../core/models/userCreate.model';
import { GenreModel } from '../../core/models/genres.model';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { AccountType } from '../../core/base/base.enum';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { MapsAPILoader } from '@agm/core';
import { AccountSearchParams } from '../../core/models/accountSearchParams.model';




@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})



export class ProfileComponent extends BaseComponent implements OnInit {
    UserId:number;
    Roles = AccountType;
    SearchParams: AccountSearchParams = new AccountSearchParams();
    Account:AccountCreateModel = new AccountCreateModel();
    Accounts:AccountGetModel[] = [];
    isMyAccount = false;
    
    constructor(protected authService: AuthMainService,
      protected accService:AccountService,
      protected imgService:ImagesService,
      protected typeService:TypeService,
      protected genreService:GenresService,
      protected _sanitizer: DomSanitizer,
      protected router: Router,public _auth: AuthService,
      private activatedRoute: ActivatedRoute,
      private ngZone: NgZone){
super(authService,accService,imgService,typeService,genreService,_sanitizer,router,_auth);
}

ngOnInit(){
  this.accService.GetMyAccount()
  .subscribe((res:AccountGetModel[])=>{
      this.isMyAccount = false;
      this.activatedRoute.params.forEach((params) => {
      this.UserId = params["id"];
      this.Accounts = res;
      for(let acc of this.Accounts) {
          if(acc.id == this.UserId) {
              this.isMyAccount = true;
          }
      }
      this.accService.GetAccountById(this.UserId, {extended:true})
        .subscribe((user:any)=>{
          console.log(user);
            this.InitByUser(user);
        })
    });
  })
  
}
  InitByUser(usr:any){
    this.Account = usr;
    if(this.Account.account_type == this.Roles.Venue)
    {
      this.Account.office_hours = this.accService.ParseWorkingTimeModelArr(this.Account.office_hours);
      this.Account.operating_hours = this.accService.ParseWorkingTimeModelArr(this.Account.operating_hours);
    }

    if(usr.image_id){
        this.imgService.GetImageById(usr.image_id)
            .subscribe((res:Base64ImageModel)=>{
                this.Account.image_base64 = res.base64;
            });
    }
 
}

LOGOUT_STUPID(){
  localStorage.removeItem('access');
  this.router.navigate(['/access']);
}

login(){
  this.router.navigate(['/system','login']);
}

logout(){
  console.log('logout');
  this.Logout();
}

FollowProfile() {
  this.accService.FollowAccountById(this.Accounts[0].id, this.UserId);
}
  

}

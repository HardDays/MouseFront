
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
import { GengreModel } from '../../core/models/genres.model';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { AccountType } from '../../core/base/base.enum';
import { Base64ImageModel } from '../../core/models/base64image.model';




@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent extends BaseComponent implements OnInit {
    UserId:number;
    Roles = AccountType;
    Account:AccountCreateModel = new AccountCreateModel();


ngOnInit(){
  this.accService.GetMyAccount({extended:true})
  .subscribe((user:any[])=>{
    console.log("UserArr",user);
      this.InitByUser(user[0]);
  })
}
  InitByUser(usr:any){
    console.log("USR",usr);
    this.Account = usr;
    this.Account.office_hours = this.accService.ParseWorkingTimeModelArr(this.Account.office_hours);
    this.Account.operating_hours = this.accService.ParseWorkingTimeModelArr(this.Account.operating_hours);
    this.UserId = usr.id?usr.id:0;

    console.log("GET", this.UserId);
    if(usr.image_id){
        this.imgService.GetImageById(this.UserId, usr.image_id)
            .subscribe((res:Base64ImageModel)=>{
                this.Account.image_base64 = res.base64;
            });
    }
 
}

edit(){
  this.router.navigate(['/system','edit']);
}



  

}

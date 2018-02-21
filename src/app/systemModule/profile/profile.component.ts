
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




@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class ProfileComponent extends BaseComponent implements OnInit {


MyAcc:AccountGetModel;


ngOnInit(){

  this.GetMyAcc();
 
}


GetMyAcc(){
    this.accService.GetMyAccount().
    subscribe((acc:AccountGetModel)=>{
      this.MyAcc = acc;
      console.log(this.MyAcc);
    });
}

  

}

import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';

import { AccountCreateModel } from '../../core/models/accountCreate.model';
import { UserCreateModel } from '../../core/models/userCreate.model';
import { GengreModel } from '../../core/models/genres.model';

@Component({
  selector: 'register',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})


export class RegistrationComponent extends BaseComponent implements OnInit {

  genres:GengreModel[] = [];
  seeMore:boolean = false;
  firstPage:boolean = true;
  Account:AccountCreateModel = new AccountCreateModel();
  User:UserCreateModel = new UserCreateModel();


  ngOnInit(){
   this.genres = this.genreService.GetMin();
   console.log(this.genres);
  }


  onSubmitSignUp(){

    this.Account.account_type = 'fan';

    console.log(this.User, this.Account);
    
    this.CreateUserAcc(this.User,this.Account);

  }

  loadLogo($event:any):void{
    console.log($event.target.files[0]);
    this.ReadImages(
        $event.target.files,
        (res:string)=>{
            this.Account.image_base64 = res;
            
        }
    );
  }

  seeMoreGenres(){
    this.seeMore = true;

    this.genres = this.genreService.GetAll();
    console.log(this.genres);
  }

}

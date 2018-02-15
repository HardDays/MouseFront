import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';

import { AccountCreateModel } from '../../core/models/accountCreate.model';
import { UserCreateModel } from '../../core/models/userCreate.model';
import { GengreModel } from '../../core/models/genres.model';
import { AccountGetModel } from '../../core/models/accountGet.model';

@Component({
  selector: 'register',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})


export class RegistrationComponent extends BaseComponent implements OnInit {

  genres:GengreModel[] = [];
  artists:AccountGetModel[] = [];
  followsId:number[] = [];
  seeMore:boolean = false;
  firstPage:boolean = true;
  Account:AccountCreateModel = new AccountCreateModel();
  User:UserCreateModel = new UserCreateModel();


  ngOnInit(){
   this.genres = this.genreService.GetMin();
   console.log(this.genres);
  }


  firstPageComp(){
    this.genreService.GetArtists(this.genres).
      subscribe((res:AccountGetModel[])=>{
    
      this.artists = res;
      console.log(`artists`, this.artists);
      this.firstPage = false;
     
    });  
  }


  onSubmitSignUp(){
    this.Account.account_type = 'fan';
    console.log(this.User, this.Account);
    this.CreateUserAcc(this.User,this.Account,this.followsId);
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
    let checked = this.genres;
    this.genres = this.genreService.GetAll(checked);

  }



}

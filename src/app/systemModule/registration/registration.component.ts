import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';

import { AccountCreateModel } from '../../core/models/accountCreate.model';
import { UserCreateModel } from '../../core/models/userCreate.model';

@Component({
  selector: 'register',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})


export class RegistrationComponent extends BaseComponent implements OnInit {


  Account:AccountCreateModel = new AccountCreateModel();
  User:UserCreateModel = new UserCreateModel();


  ngOnInit(){
   
  }


  onSubmitSignUp(){

    this.Account.account_type = 'fan';

    console.log(this.User, this.Account);
    
    // this.CreateUserAcc(this.User,this.Account);

  }

  loadLogo($event:any):void{
    console.log($event.target.files[0]);
    this.ReadImages(
        $event.target.files,
        (res:string)=>{
            this.Account.image = res;
            
        }
    );
  }

}

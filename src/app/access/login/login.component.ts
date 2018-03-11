import { Component } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { isError } from 'util';
import { LoginModel } from '../../core/models/login.model';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent extends BaseComponent implements OnInit {

  isErrorLogin:boolean = false;
  isForgotPassSend:boolean = false;
  userLogin:LoginModel = new LoginModel();
  curPage:number = 1;
  emailPhone:string = '';
  forgotCode:string = '';
  newPass:string = '';
  newPassComfirm:string = '';

  ngOnInit(){
    // if (this.isLoggedIn)
    //   this.router.navigate(['/system','shows']);
  }

  onSubmitSignIn(){
    // let username = form.controls.username.value, password = form.controls.password.value;
    this.Login(this.userLogin,(err)=>{
      console.log(err);
      if(err.status==401) {
        this.isErrorLogin = true;
      }
    });
  }

  signInGoFb(provider){
   this.SocialLogin(provider);
  }

  logoutGoFb(){
    this.SocialLogout('gf');
  }

  forgotPassword(){
    this.curPage = 2;
  }

  sendCode(){
    this.curPage = 3;
     this.authService.ForgotPassword(this.emailPhone)
    .subscribe(()=>{
      console.log(`forgot pass send!`);
    })
  }
  analisCode(){
    this.curPage = 4;
  }

  changePass(){
    this.curPage = 1;
  }
}

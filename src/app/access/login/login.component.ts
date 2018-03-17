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

  accessVkToken:string = '';

  ngOnInit(){
    // if (this.isLoggedIn)
    //   this.router.navigate(['/system','shows']);



      var params: string[] = location.href.slice(location.href.indexOf('#')+1,location.href.length).split('&');
      for(let p of params) if(p.split('=')[0] == 'access_token') this.accessVkToken = p.split('=')[1];
      console.log(this.accessVkToken);
      if(this.accessVkToken.length>0) this.authService.UserLoginByVk(this.accessVkToken).
                                      subscribe((res)=>{
                                        console.log(`vk ok`);
                                        this.router.navigate(['/system','shows']);
                                      });
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

  signInVK(){
    window.close();
    window.open("https://oauth.vk.com/authorize?client_id=6412516&redirect_uri=http://localhost:4200/login&display=page&response_type=token&v=5.73&state=123456");
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

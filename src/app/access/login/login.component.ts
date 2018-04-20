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
  accessTwitterToken:string = '923927835315785728-iAyJ85E2HwDLIdmBJ8ca1VBIdlGBd9W';
  accessTwitterSecretToken:string = 'jH56gmOmhtodHnttk65J5Mo6f9pVJyIZkm7xvtYPmuEDG';

  ngOnInit(){
    // if (this.isLoggedIn)
    //   this.router.navigate(['/system','shows']);



      var params: string[] = location.href.slice(location.href.indexOf('#')+1,location.href.length).split('&');
      for(let p of params) if(p.split('=')[0] == 'access_token') this.accessVkToken = p.split('=')[1];
      
      if(this.accessVkToken.length>0) this.authService.UserLoginByVk(this.accessVkToken).
                                      subscribe((res)=>{
                                        //console.log(`vk ok`,res);
                                        this.authService.BaseInitAfterLogin(res);
                                        // this.router.navigate(['/system','shows']);
                                        this.router.navigate(['/system','shows']);
                                      });
      // //console.log("tw_token", this.accessTwitterToken);
      // console.log("secret", this.accessTwitterSecretToken);
      // if(this.accessTwitterToken.length>0) this.authService.UserLoginByTwitter(this.accessTwitterToken, this.accessTwitterSecretToken).
      //                                 subscribe((res)=>{
      //                                   console.log(`twitter ok`,res);
      //                                   this.authService.BaseInitAfterLogin(res);
      //                                   // this.router.navigate(['/system','shows']);
      //                                   this.router.navigate(['/system','shows']);
      //                                 });
  }

  onSubmitSignIn(){
    // let username = form.controls.username.value, password = form.controls.password.value;
    this.Login(this.userLogin,(err)=>{
      //console.log(err);
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
    //window.open("https://oauth.vk.com/authorize?client_id=6412516&redirect_uri=http://localhost:4200/login&display=page&response_type=token&v=5.73&state=123456");
    window.open("https://oauth.vk.com/authorize?client_id=6326995&display=page&redirect_uri=https://mouse-web.herokuapp.com/login&scope=friends&response_type=token&v=5.73&scope=offline");
  }

  signInTwitter(){
    // window.close();
    //window.open("https://oauth.vk.com/authorize?client_id=6412516&redirect_uri=http://localhost:4200/login&display=page&response_type=token&v=5.73&state=123456");
    // window.open("https://api.twitter.com/oauth/authenticate?oauth_token=jH56gmOmhtodHnttk65J5Mo6f9pVJyIZkm7xvtYPmuEDG");
    this.authService.Twitter().subscribe((res)=>{
      // console.log(`twitter`,res)
    },(err)=>{//console.log(`tw err`,err)
  });
    
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
      //console.log(`forgot pass send!`);
    })
  }

  analisCode(){
    this.curPage = 4;
  }

  changePass(){
    this.curPage = 1;
  }
}

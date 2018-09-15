import { Component, ViewChild } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { isError } from 'util';
import { LoginModel } from '../../core/models/login.model';
import { BaseMessages } from '../../core/base/base.enum';
import { ErrorComponent } from '../../shared/error/error.component';

declare var VK:any;

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent extends BaseComponent implements OnInit {

  isErrorLogin: boolean = false;
  isForgotPassSend: boolean = false;
  userLogin: LoginModel = new LoginModel();
  curPage: number = 1;

  forgotUsername:string = '';
  forgotEmail:string = '';

  forgotCode:string = '';

  oldPass:string = '';
  newPass:string = '';
  newPassComfirm:string = '';

  accessVkToken:string = '';
  // accessTwitterToken:string = '923927835315785728-iAyJ85E2HwDLIdmBJ8ca1VBIdlGBd9W';
  // accessTwitterSecretToken:string = 'jH56gmOmhtodHnttk65J5Mo6f9pVJyIZkm7xvtYPmuEDG';
  @ViewChild('errorCmp') errorCmp: ErrorComponent;
  ngOnInit()
  {
    // if (this.isLoggedIn)
    //   this.router.navigate(['/system','shows']);

    var params: string[] = location.href.slice(location.href.indexOf('#')+1,location.href.length).split('&');

    for(let p of params)
    {
      if(p.split('=')[0] == 'access_token')
      {
        this.accessVkToken = p.split('=')[1];
      }
    }

    if(this.accessVkToken.length>0)
    {

      this.main.authService.UserLoginByVk(this.accessVkToken)
        .subscribe
        (
          (res)=>
          {
            this.main.MyAccountsChange.subscribe(
              (accs)=>{
                if(this.main.MyAccounts.length>0){
                  console.log(`main.MyAccounts.length>0`);
                  this.router.navigate(['/system','shows']);
                }
                else
                {
                  console.log(`create new acc`);
                  this.router.navigate(['/social']);
                }
              }
            )
            this.main.authService.BaseInitAfterLogin(res);
            this.main.authService.onAuthChange$.next(true);


            // setTimeout(() => {
            //   // console.log(this.main.MyAccounts);

            // }, 1000);

          }
        );
    }
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

  onSubmitSignIn()
  {
    this.Login(
      this.userLogin,
      (err)=>
      {
        this.OpenErrorWindow(BaseMessages.Incorrect);
      }
    );
  }
  OpenErrorWindow(str:string)
  {
    this.errorCmp.OpenWindow(str);
  }
  signInGoFb(provider)
  {
   this.SocialLogin(provider);
  }

  signInVK()
  {
    // window.close();
    // VK.init({apiId: 6326995});

    // setTimeout(() => {
    //   VK.Auth.login((res)=>{
    //     console.log(res);
    //     if(res.session.sid.length>0)
    //     {
    //       console.log(res.session.sid);
    //       this.main.authService.UserLoginByVk(res.session.sid)
    //         .subscribe
    //         (
    //           (res)=>
    //           {
    //             this.main.authService.BaseInitAfterLogin(res);
    //             this.main.authService.onAuthChange$.next(true);

    //             setTimeout(() => {
    //               // console.log(this.main.MyAccounts);
    //               if(this.main.MyAccounts.length>0)
    //                 this.router.navigate(['/system','shows']);
    //               else {
    //                 // console.log(`create new acc`);
    //                 this.router.navigate(['/social']);
    //               }
    //             }, 1000);

    //           }
    //         );
    //     }
    //   });
    // }, 500);

    // VK.Observer.subscribe('auth.logout',(res)=>{
    //   console.log(`subscribe`,res);
    // })



    // window.location.replace("https://oauth.vk.com/authorize?client_id=6326995&display=page&redirect_uri=http://localhost:4200/login&scope=friends&response_type=token&v=5.73&scope=offline");
     window.location.replace("https://oauth.vk.com/authorize?client_id=6326995&display=page&redirect_uri=https://mouse-web.herokuapp.com/login&scope=friends&response_type=token&v=5.73&scope=offline");
  }

  VkLogout(){
     VK.init({apiId: 6326995});
    setTimeout(() => {
      VK.Auth.logout((res)=>{
        console.log(res);
      });
    }, 500);
    VK.Observer.subscribe('auth.logout',(res)=>{
      console.log(`subscribe`,res);
    })
  }

  // signInTwitter(){
  //   // window.close();
  //   //window.open("https://oauth.vk.com/authorize?client_id=6412516&redirect_uri=http://localhost:4200/login&display=page&response_type=token&v=5.73&state=123456");
  //   // window.open("https://api.twitter.com/oauth/authenticate?oauth_token=jH56gmOmhtodHnttk65J5Mo6f9pVJyIZkm7xvtYPmuEDG");
  //   this.authService.Twitter().subscribe((res)=>{
  //     // console.log(`twitter`,res)
  //   },(err)=>{//console.log(`tw err`,err)
  // });

  // }
  logoutGoFb()
  {
    this.SocialLogout('gf');
  }

  forgotPassword()
  {
    this.curPage = 2;
  }

  sendCode(){

     this.main.authService.ForgotPassword(this.forgotUsername,this.forgotEmail)
      .subscribe
      (
        ()=>
        {
          this.curPage = 3;
        },
        (err)=>{
          if(err.json()['error'] === 'LOGIN_DOES_NOT_EXIST')
            this.OpenErrorWindow('Please, input correct username and e-mail!');
        }
      )
  }


  changePass()
  {
    let login:LoginModel = new LoginModel(this.forgotUsername,this.oldPass);

    this.Login(
      login,
      (err)=>
      {
        if(err.status==401) {
          this.isErrorLogin = true;
        }
      },
      (res)=>
      {
        this.main.authService.UserPatchPassword(this.newPass,this.oldPass)
          .subscribe
          (
            (res)=>
            {
              this.router.navigate(['/system','shows'])
            }
          )
     }
    );
  }

}

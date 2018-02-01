import { Component } from '@angular/core';
import { NgForm} from '@angular/forms';
import { MainService } from '../core/services/main.service';
import { AuthService } from "angular2-social-login";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent {

  private socToken:any;
  private sub:any;

  constructor(private service:MainService, public _auth: AuthService){}

  onSubmitSignIn(form: NgForm){
    let username = form.controls.username.value, password = form.controls.password.value;
    this.service.UserLogin(username,password).subscribe((res)=>{
      console.log(res);
    });
  }

  signInGoFb(provider){
    this.sub = this._auth.login(provider).subscribe(
      (data) => {
                  console.log(data);
                  this.socToken = data;
                  //user data 
                  //name, image, uid, provider, uid, email, token (accessToken for Facebook & google, no token for linkedIn), idToken(only for google)
                  if (provider=="google")
                    this.service.UserLoginByGoogle(this.socToken.token).
                      subscribe((res)=>{
                          console.log(`g:`,res);
                      });

                  else if (provider=="facebook")
                    this.service.UserLoginByFacebook(this.socToken.token).
                    subscribe((res)=>{
                        console.log(`f:`,res);
                    });
                }
    )
  }

  logoutGoFb(){
    this._auth.logout().subscribe(
      (data)=>{//return a boolean value.
      } 
    );
  }

}

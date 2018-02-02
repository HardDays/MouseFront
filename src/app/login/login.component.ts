import { Component } from '@angular/core';
import { NgForm} from '@angular/forms';
import { MainService } from '../core/services/main.service';

import { BaseComponent } from '../core/base/base.component';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent extends BaseComponent implements OnInit {

 
  ngOnInit(){
    if(this.isLoggedIn)  this.router.navigate(['/system','open']);
  }

  onSubmitSignIn(form: NgForm){
    let username = form.controls.username.value, password = form.controls.password.value;
    this.Login(username,password,(err)=>{console.log(err)});
  }

  signInGoFb(provider){
   this.SocialLogin(provider);
  }

  logoutGoFb(){
    this.SocialLogout('gf');
  }

}

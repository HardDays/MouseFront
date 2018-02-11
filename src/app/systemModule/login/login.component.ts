import { Component } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';

import { BaseComponent } from '../../core/base/base.component';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { isError } from 'util';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent extends BaseComponent implements OnInit {

  isErrorLogin:boolean = false;

  ngOnInit(){
    // if (this.isLoggedIn)
    //   this.router.navigate(['/system','shows']);
  }

  onSubmitSignIn(form: NgForm){
    let username = form.controls.username.value, password = form.controls.password.value;
    this.Login(username,password,(err)=>{
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

}

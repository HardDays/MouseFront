import { Component } from '@angular/core';
import { NgForm} from '@angular/forms';
import { MainService } from '../core/services/main.service';

import { BaseComponent } from '../core/base/base.component';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { UserCreateModel } from '../core/models/user-create.model';

@Component({
  selector: 'register',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})


export class RegistrationComponent extends BaseComponent implements OnInit {

  User:UserCreateModel = new UserCreateModel();

  stupidAccessShow: boolean = true;

  ngOnInit(){
    this.stupidAccessShow = this.service.stupidAccessShow;
  }

  StupidAccess(form:NgForm){
    let pass = form.controls.access.value;
    if(pass=="PASSWORD") {
      this.service.stupidAccessShow = false;
      this.stupidAccessShow = false;
    }
  }

  onSubmitSignUp(form: NgForm){
    console.log(form);
   
    let password = form.controls.password.value;
    this.User.user_name = form.controls.username.value;
    this.User.email = form.controls.email.value;
    this.User.phone = form.controls.phone.value;

    this.CreateUserAcc(this.User,password);

  }

  loadLogo($event:any):void{
    console.log($event);
    this.ReadImages(
        $event.target.files,
        (res:string)=>{
          console.log(`r`,res);
            this.User.image = res;
        }
    );
}
}

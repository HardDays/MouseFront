import { Component } from '@angular/core';
import { NgForm} from '@angular/forms';
import { MainService } from '../core/services/main.service';

import { BaseComponent } from '../core/base/base.component';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'register',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})


export class RegistrationComponent extends BaseComponent implements OnInit {
  ngOnInit(){

  }

  onSubmitSignUp(form: NgForm){
    console.log(form);

    let username = form.controls.username.value,
        email = form.controls.email.value,
        password = form.controls.password.value,
        phone = form.controls.phone.value;
        //image = form.controls.image.value;

    this.CreateUserAcc(username,email,password,location,phone);

  }
}

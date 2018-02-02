import { Component } from '@angular/core';
import { NgForm} from '@angular/forms';
import { MainService } from '../../core/services/main.service';
import { AuthService } from "angular2-social-login";
import { BaseComponent } from '../../core/base/base.component';

@Component({
  selector: 'login',
  templateUrl: './open.component.html',
  styleUrls: ['./open.component.css']
})


export class OpenComponent extends BaseComponent {

  LOGOUT(){
    this.Logout();
  }
 

}

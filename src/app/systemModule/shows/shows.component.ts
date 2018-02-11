import { Component } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';
import { AuthService } from "angular2-social-login";
import { BaseComponent } from '../../core/base/base.component';

@Component({
  selector: 'shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.css']
})


export class ShowsComponent extends BaseComponent {

  LOGOUT_STUPID(){
    localStorage.removeItem('access');
    this.router.navigate(['/access']);
  }
  login(){
    this.router.navigate(['/system','login']);
  }

  logout(){
    console.log('logout');
    this.Logout();
  }
 

}

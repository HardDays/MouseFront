import { Component } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';
import { AuthService } from "angular2-social-login";
import { BaseComponent } from '../../core/base/base.component';
import { AccountGetModel } from '../../core/models/accountGet.model';

@Component({
  selector: 'shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.css']
})


export class ShowsComponent extends BaseComponent {


  ngOnInit(){
    
  }
  
}

import { Component,OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { AuthMainService } from './core/services/auth.service';
import { BaseComponent } from './core/base/base.component';

declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent extends BaseComponent implements OnInit {
  isLoggedIn:boolean = false;
  ngOnInit(){
    this.main.authService.onAuthChange$.subscribe(bool => {
      this.isLoggedIn = bool;
      if(this.isLoggedIn)
          this.main.authService.GetMe().subscribe(it =>{
            }
          );
    });
    this.main.authService.TryToLoginWithToken();
  }

 
}

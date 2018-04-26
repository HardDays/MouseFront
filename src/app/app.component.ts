import { Component,OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { AuthMainService } from './core/services/auth.service';

declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  isLoggedIn:boolean = false;
  constructor(private service:AuthMainService){}
  ngOnInit(){
    this.service.onAuthChange$.subscribe(bool => {
      this.isLoggedIn = bool;
      if(this.isLoggedIn)
          this.service.GetMe().subscribe(it =>{
            }
          );
    });
    this.service.TryToLoginWithToken();
  }

 
}

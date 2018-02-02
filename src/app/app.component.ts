import { Component,OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { MainService } from './core/services/main.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  isLoggedIn:boolean = false;
  constructor(private service:MainService){}
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

import { Component,OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  title = 'app';
  constructor(){}
  ngOnInit(){
    // this.service.onAuthChange$.subscribe(bool => {
    //   this.isLoggedIn = bool;
    //   if(this.isLoggedIn)
    //       this.service.GetMe().subscribe(it =>{
    //         }
    //       );
    // });
    // this.service.TryToLoginWithToken();
  }
}

import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent extends BaseComponent implements OnInit {

  Usage = { clicks:0, comments:0, likes:0};
  New = {fan:0, artist:0, venue:0}

  ngOnInit() {

    this.main.adminService.GetAccountsUserUsage()
      .subscribe(
        (res)=>{
          console.log(`Usage`,res);
          this.Usage = res;
        }
      )

      this.main.adminService.GetAccountsNew()
      .subscribe(
        (res)=>{
          console.log(`Usage`,res);
          this.New = res;
        }
      )
    
  }

}

import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  Counts = {fan:0, artist:0, venue:0};

  ngOnInit() {
    this.main.adminService.GetNewAccountsCount()
      .subscribe(
        (res)=>{
          this.Counts = res;
        }
      )
  }

}

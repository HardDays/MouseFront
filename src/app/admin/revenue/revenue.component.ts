import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent extends BaseComponent implements OnInit {

  Revenues:any[] = [];

  ngOnInit() {
    this.main.adminService.GetRevenues()
      .subscribe(
        (res)=>{
          this.Revenues = res;
        }
      )
  }

}

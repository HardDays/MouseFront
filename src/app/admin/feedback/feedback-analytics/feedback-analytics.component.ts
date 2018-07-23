import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';

@Component({
  selector: 'app-feedback-analytics',
  templateUrl: './feedback-analytics.component.html',
  styleUrls: ['./feedback-analytics.component.css']
})
export class FeedbackAnalyticsComponent extends BaseComponent implements OnInit {

  Info = {
      bug: 0,
      enhancement: 0,
      compliment: 0
  }

  Rate = 0;

  ngOnInit() {
    this.main.adminService.GetFeedbacksCounts()
      .subscribe(
        (res)=>{
          this.Info = res;
        }
      )
    this.main.adminService.GetFeedbacksOverall()
      .subscribe(
        (res)=>{
          this.Rate = res;
        }
      )
  }

}

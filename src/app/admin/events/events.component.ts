import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { Params } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent extends BaseComponent implements OnInit {

  isApprovedBy:boolean = false;
  isShowTable:boolean = true;
  status:string = 'new';

  Events: any[] = [];
  
  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params:Params) => {
        this.status = params['id']; // console.log(params["id"]);
        this.isShowTable = true;
        if(this.status === 'analytics'||this.status === 'invites'){
          this.isShowTable = false;
        }
        else if(this.status != 'new'&& this.status != 'all'){
          this.isApprovedBy = true;
        }
        else {
          this.isApprovedBy = false;
        }
      }
    );
    console.log(`---`,this.isApprovedBy);

    this.getEvents();
  }

  getEvents(){
    this.main.adminService.GetEventsRequests()
      .subscribe((res)=>{
        this.Events = res;
      })
  }

}

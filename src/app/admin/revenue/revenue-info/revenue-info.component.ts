import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { Params } from '../../../../../node_modules/@angular/router';
import { EventGetModel } from '../../../core/models/eventGet.model';
import { BaseImages } from '../../../core/base/base.enum';

@Component({
  selector: 'app-revenue-info',
  templateUrl: './revenue-info.component.html',
  styleUrls: ['./revenue-info.component.css']
})
export class RevenueInfoComponent extends BaseComponent implements OnInit {

  Id:number = 0;
  Revenue:any = null;
  Event:EventGetModel = new EventGetModel();

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params:Params) => {
        this.Id = params['id']; // console.log(params["id"]);
        if(this.Id)
          this.getRevenue()
      }
    );
    // console.log(`---`,this.isApprovedBy);

    
  }

  getRevenue(){
    this.main.adminService.GetRevenueById(this.Id)
      .subscribe(
        (res)=>{
          this.Revenue = res;
          console.log(this.Revenue);
          this.main.eventService.GetEventById(this.Revenue.id)
            .subscribe(
              (event)=>{
                this.Event = event;
                if(this.Event.image_id)
                  this.Event.image_base64 = this.main.imagesService.GetImagePreview(this.Event.image_id,{width:400,height:500})
                else
                  this.Event.image_base64 = BaseImages.NoneFolowerImage;
                console.log(this.Event);
              }
            )
        }
      )
  }

}

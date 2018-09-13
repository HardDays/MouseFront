import { Component, OnInit, HostListener } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { Params } from '@angular/router';
import { EventGetModel } from '../../../core/models/eventGet.model';
import { BaseImages } from '../../../core/base/base.enum';

declare var $:any;

@Component({
  selector: 'app-revenue-info',
  templateUrl: './revenue-info.component.html',
  styleUrls: ['./revenue-info.component.css']
})
export class RevenueInfoComponent extends BaseComponent implements OnInit {

  Id:number = 0;
  Revenue:any = null;
  Event:EventGetModel = new EventGetModel();

  mapCoords =  {lat:55.755826, lng:37.6172999};

  isShowMap = false;

  ESCAPE_KEYCODE = 27;
  ENTER_KEYCODE = 13;

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
      if(this.isShowMap){
          if (event.keyCode === this.ESCAPE_KEYCODE || event.keyCode === this.ENTER_KEYCODE) {
            $('#modal-map-1').modal('hide');
            this.isShowMap = false;
          }
      }
  }

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

  aboutOpenMapModal(){
    if(this.Event.city_lat&&this.Event.city_lng){
      $('#modal-map-1').modal('show');
      this.isShowMap = true;
    }
  }

  getRevenue(){
    this.main.adminService.GetRevenueById(this.Id)
      .subscribe(
        (res)=>{
          this.Revenue = res;
          // console.log(this.Revenue);
          this.main.eventService.GetEventById(this.Revenue.id)
            .subscribe(
              (event)=>{
                this.Event = event;
                this.mapCoords = {lat:+this.Event.city_lat,lng:+this.Event.city_lng};
                if(this.Event.image_id)
                  this.Event.image_base64 = this.main.imagesService.GetImagePreview(this.Event.image_id,{width:400,height:500})
                else
                  this.Event.image_base64 = BaseImages.NoneFolowerImage;
                // console.log(this.Event);
              }
            )
        }
      )
  }

}

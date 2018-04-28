import { Component, Input, OnInit } from '@angular/core';

import { BaseComponent } from '../../core/base/base.component';
import { BaseImages } from '../../core/base/base.enum';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { TicketsGetModel } from '../../core/models/ticketsGetModel';

@Component({
  selector: 'app-upcoming-shows-profile',
  templateUrl: './upcoming-shows-profile.component.html',
  styleUrls: ['./upcoming-shows-profile.component.css']
})
export class UpcomingShowsProfileComponent extends BaseComponent implements OnInit  {
  @Input() Upshows: any;
  FoundedPercent:number = 0;
  Image:string;
 

  ngOnInit(): void {
    this.GetImage();
  }
  GetImage()
  {
      if(this.Upshows && this.Upshows.image_id)
      {
          this.WaitBeforeLoading(
              () => this.imgService.GetImageById(this.Upshows.image_id),
              
              (res:Base64ImageModel) => {
              
                  this.Image = (res && res.base64) ? res.base64 : BaseImages.Drake;
              },
              (err) =>{
                  this.Image = BaseImages.Drake;
              }
          );
      }
      else{
          this.Image = BaseImages.Drake;
      }
  }

}

import { Component, Input, OnInit } from '@angular/core';

import { BaseComponent } from '../../../core/base/base.component';
import { BaseImages } from '../../../core/base/base.enum';
import { Base64ImageModel } from '../../../core/models/base64image.model';
import { TicketsGetModel } from '../../../core/models/ticketsGetModel';

@Component({
  selector: 'app-upcoming-shows-profile',
  templateUrl: './upcoming-shows-profile.component.html',
  styleUrls: ['./upcoming-shows-profile.component.css']
})
export class UpcomingShowsProfileComponent extends BaseComponent implements OnInit  {
  @Input() Upshows: any;
  FoundedPercent:number = 0;
  Image:string = BaseImages.Drake;
  Date:string = '';
 

  ngOnInit(): void 
  {
    this.GetImage();
    if(this.Upshows.exact_date_from)
    {
      this.Date = this.main.typeService.DateToUTCDateISOString(this.Upshows.exact_date_from);
    }
    else if (this.Upshows.date_from)
    {
      this.Date = this.main.typeService.DateToUTCDateISOString(this.Upshows.date_from);
    }
  }

  GetImage()
  {
      if(this.Upshows && this.Upshows.image_id)
      {
        this.Image = this.main.imagesService.GetImagePreview(this.Upshows.image_id,{width:400,height:340});
      }
  }

}

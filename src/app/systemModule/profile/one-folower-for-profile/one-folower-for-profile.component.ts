import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { BaseComponent } from '../../../core/base/base.component';
import { BaseImages } from '../../../core/base/base.enum';
import { Base64ImageModel } from '../../../core/models/base64image.model';
import { TicketsGetModel } from '../../../core/models/ticketsGetModel';
@Component({
  selector: 'app-one-folower-for-profile',
  templateUrl: './one-folower-for-profile.component.html',
  styleUrls: ['./one-folower-for-profile.component.css']
})
export class OneFolowerForProfileComponent extends BaseComponent implements OnInit,OnDestroy {
   
  @Input() Folower: any;
  Image:string = BaseImages.Drake;


  ngOnInit(): void  {
    this.GetImage();
  }
  ngOnDestroy(): void {
   this.Folower = null;
   this.Image = '';
}
  GetImage()
  {
      if(this.Folower && this.Folower.image_id)
      {
          this.main.imagesService.GetImageById(this.Folower.image_id)
            .subscribe(
                (res:Base64ImageModel) => {
                
                    this.Image = (res && res.base64) ? res.base64 : BaseImages.NoneFolowerImage;
                }
            );
      }
      else 
      {
        this.Image = BaseImages.NoneFolowerImage;
      }
  }

}

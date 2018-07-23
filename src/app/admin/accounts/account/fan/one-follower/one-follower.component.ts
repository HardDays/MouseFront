import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { BaseComponent } from '../../../../../core/base/base.component';
import { BaseImages } from '../../../../../core/base/base.enum';
import { Base64ImageModel } from '../../../../../core/models/base64image.model';

@Component({
  selector: 'app-one-follower',
  templateUrl: './one-follower.component.html',
  styleUrls: ['./one-follower.component.css']
})
export class OneFollowerComponent extends BaseComponent implements OnInit,OnDestroy {
   
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


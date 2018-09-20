import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { BaseImages } from '../../../core/base/base.enum';

@Component({
  selector: 'app-new-admin',
  templateUrl: './new-admin.component.html',
  styleUrls: ['./new-admin.component.css']
})
export class NewAdminComponent extends BaseComponent implements OnInit {

  @Input() NewAdmin:{
    created_at: string,
    admin: {id: number, first_name: string, last_name: string, user_name: string, image_id: number, image:string}
  };


  ngOnInit() {
    if(this.NewAdmin.admin){
      if(this.NewAdmin.admin.image_id){
        this.NewAdmin.admin.image = this.main.imagesService.GetImagePreview(this.NewAdmin.admin.image_id,{width:150,height:150});
      }
      else{
        this.NewAdmin.admin.image = BaseImages.NoneFolowerImage;
      }
    }
  }

}

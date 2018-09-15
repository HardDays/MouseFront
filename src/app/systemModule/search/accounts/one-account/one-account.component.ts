import { Component, OnInit, Input } from "@angular/core";
import { BaseComponent } from "../../../../core/base/base.component";
import { AccountGetModel } from "../../../../core/models/accountGet.model";
import { BaseImages } from '../../../../core/base/base.enum';

@Component({
    selector: 'one-account-search-component',
    templateUrl: './one-account.component.html',
    styleUrls: ['./../../search.component.css']
  })
  
  export class OneAccountSearchComponent extends BaseComponent implements OnInit {
    @Input() Account: AccountGetModel;

    Image:string = BaseImages.NoneFolowerImage;
    ngOnInit(): void {
        this.GetImage();
    }
    GetImage()
    {
        if(this.Account.image_id)
        {
            this.Image = this.main.imagesService.GetImagePreview(this.Account.image_id,{width: 100, height: 100});
        }
    }
    Navigate()
    {
        this.router.navigate(['/system','profile', this.Account.id]);
    }
  }
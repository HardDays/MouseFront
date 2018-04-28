import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { BaseImages } from '../../core/base/base.enum';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { AccountGetModel } from '../../core/models/accountGet.model';


@Component({
    selector: 'biography-selector',
    templateUrl: './biography.component.html',
    styleUrls: ['./biography.component.css']
})
export class BiographyComponent extends BaseComponent implements OnInit {
    @Input() Account: AccountGetModel;
    Image:string = BaseImages.Drake;

    ngOnInit(): void 
    {
        this.GetImage();
    }

    GetImage()
    {
        if(this.Account && this.Account.image_id)
        {
            this.WaitBeforeLoading(
                () => this.main.imagesService.GetImageById(this.Account.image_id),
                (res:Base64ImageModel) => {
                    this.Image = (res && res.base64) ? res.base64 : BaseImages.Drake;
                }
            );
        }
    }
}
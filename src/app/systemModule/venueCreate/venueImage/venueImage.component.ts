import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseImages } from '../../../core/base/base.enum';
import { BaseComponent } from '../../../core/base/base.component';
import { ImageAccModel } from '../../../core/models/imageAcc.model';
import { Base64ImageModel } from '../../../core/models/base64image.model';


@Component({
    selector: 'venue-image-selector',
    templateUrl: './venueImage.component.html',
})
export class VenueMediaPhotoComponent extends BaseComponent implements OnInit {
    @Input() Image: ImageAccModel;
    @Output() onDeleteImage:EventEmitter<ImageAccModel> = new EventEmitter<ImageAccModel>();
    Base64:string = BaseImages.Drake;

    ngOnInit(): void 
    {
        this.GetImage();
    }

    GetImage()
    {
        this.WaitBeforeLoading(
            () => this.main.imagesService.GetImageById(this.Image.id),
            (res:Base64ImageModel) => {
                this.Base64 = res.base64?res.base64:BaseImages.Drake;
            }
        );
    }

    DeleteImage()
    {
        this.onDeleteImage.emit(this.Image);
    }
}
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BaseImages } from '../../../core/base/base.enum';
import { BaseComponent } from '../../../core/base/base.component';
import { ImageAccModel } from '../../../core/models/imageAcc.model';
import { Base64ImageModel } from '../../../core/models/base64image.model';


@Component({
    selector: 'venue-image-selector',
    templateUrl: './venueImage.component.html',
    styleUrls: ['./../venueCreate.component.css']
})
export class VenueMediaPhotoComponent extends BaseComponent implements OnInit {
    @Input() Image: ImageAccModel;
    @Output() onDeleteImage:EventEmitter<ImageAccModel> = new EventEmitter<ImageAccModel>();
    @Output() onError:EventEmitter<string> = new EventEmitter<string>();
    Base64:string = BaseImages.Drake;

    ngOnInit(): void 
    {
        this.GetImage();
    }

    GetImage()
    {
        this.Base64 = this.main.imagesService.GetImagePreview(this.Image.id,{width:500,height:240});
    }

    DeleteImage()
    {
        this.onDeleteImage.emit(this.Image);
    }
}
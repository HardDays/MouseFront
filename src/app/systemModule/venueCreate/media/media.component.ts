import { Component, Input, OnInit, ElementRef, EventEmitter, ViewChild, NgZone, Output, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { ContactModel } from '../../../core/models/contact.model';
import { SelectModel } from '../../../core/models/select.model';
import { VenueMediaPhotoModel } from '../../../core/models/venueMediaPhoto.model';
import { ImageAccModel, ImageAccModelAnswer } from '../../../core/models/imageAcc.model';
import { BaseMessages } from '../../../core/base/base.enum';

declare var $:any;

@Component({
    selector: 'venue-media-selector',
    templateUrl: './media.component.html',
    styleUrls: ['./../venueCreate.component.css']
})
export class VenueMediaComponent extends BaseComponent implements OnInit,OnChanges {
    @Input() Venue: AccountCreateModel;
    @Input() VenueId: number;
    @Output() onSaveVenue:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();
    @Output() onError:EventEmitter<string> = new EventEmitter<string>();
    @Output() onVenueChanged:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();

    ImageToLoad:VenueMediaPhotoModel = new VenueMediaPhotoModel();

    VenueImages:ImageAccModel[] = [];

    ImageTypes: SelectModel[] = [];

    mediaForm : FormGroup = new FormGroup({
        "vr": new FormControl("",[]),
        "audio_description" : new FormControl("",[Validators.required,
                                                Validators.maxLength(1000)]),
        "lighting_description" : new FormControl("",[Validators.required,
                                                    Validators.maxLength(1000)]),
        "stage_description" : new FormControl("",[Validators.required,
                                                Validators.maxLength(1000)])
    });

    CreateOnModelChangeForParent()
    {
        this.mediaForm.valueChanges.forEach(
            (value:any) => {
                this.onVenueChanged.emit(this.Venue);
            });
    }

    ngOnInit(): void
    {
        this.ImageTypes = this.main.typeService.GetAllImageTypes();

        this.Init();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.Init(changes.Venue.currentValue,changes.VenueId.currentValue);
    }

    Init(venue?:AccountCreateModel,id?:number)
    {
        if(venue)
            this.Venue = venue;
        if(id)
            this.VenueId = id;

        this.CreateOnModelChangeForParent();
        this.GetVenueImages();
    }

    GetVenueImages()
    {
        this.WaitBeforeLoading(
        () => this.main.imagesService.GetAccountImages(this.VenueId),
        (res:ImageAccModelAnswer) => {
            if(res && res.total_count > 0)
            {
                this.VenueImages = res.images;
            }
        }
        );
    }

    SaveVenue()
    {

        this.mediaForm.updateValueAndValidity();
        if(this.mediaForm.invalid)
        {
            this.onError.emit(this.getFormErrorMessage(this.mediaForm, 'venue'));
            return;
        }
        $('html,body').animate({
            scrollTop: 0
        }, 0);
        this.onSaveVenue.emit(this.Venue);
    }

    loadImage($event:any):void
    {
        let target = $event.target;
        if(target.files.length === 0)
            return;

        for(let file of target.files)
        {
            let reader:FileReader = new FileReader();
            reader.onload = (e) =>{
                this.ImageToLoad.image_base64 = reader.result;
            }
            reader.readAsDataURL(file);
        }
    }

    DeleteImageFromLoading()
    {
        this.ImageToLoad.image_base64 = '';
    }

    AddVenuePhoto()
    {
        if(this.ImageToLoad.image_type !== "other" && this.ImageToLoad.image_type_description)
        {
            this.ImageToLoad.image_type_description = "";
        }

        this.WaitBeforeLoading(
            () => this.main.imagesService.PostAccountImage(this.VenueId,this.ImageToLoad),
            (res:any) => {
                this.onError.emit(BaseMessages.Success);
                this.ImageToLoad = new VenueMediaPhotoModel();
                this.ImageToLoad.image_description = "";
                this.GetVenueImages();
            },
            (err) => {
                this.onError.emit(this.getResponseErrorMessage(err, 'venue'));
                this.GetVenueImages();
            }
        );
    }

    DeleteImage(image:ImageAccModel)
    {
        this.WaitBeforeLoading(
            () => this.main.imagesService.DeleteImageById(image.id,image.account_id),
            (res) => {

                this.onError.emit(BaseMessages.Success);
                this.VenueImages.splice(
                    this.VenueImages.findIndex( obj => obj.id === image.id),
                    1
                );
                this.GetVenueImages();
            },
            (err) => {
                this.onError.emit(this.getResponseErrorMessage(err, 'venue'));
            }
        );
    }
}

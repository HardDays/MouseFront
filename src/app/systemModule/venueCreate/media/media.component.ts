import { Component, Input, OnInit, ElementRef,EventEmitter, ViewChild, NgZone, Output } from '@angular/core';
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


@Component({
    selector: 'venue-media-selector',
    templateUrl: './media.component.html',
    styleUrls: ['./../venueCreate.component.css']
})
export class VenueMediaComponent extends BaseComponent implements OnInit {
    @Input() Venue: AccountCreateModel;
    @Input() VenueId: number;
    @Output() onSaveVenue:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();
    @Output() onError:EventEmitter<string> = new EventEmitter<string>();

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

    ngOnInit(): void 
    {
        this.ImageTypes = this.main.typeService.GetAllSpaceTypes();

        this.Init();
    }

    Init(venue?:AccountCreateModel,id?:number)
    {
        if(venue)
            this.Venue = venue;
        if(id)
            this.VenueId = id;
        
        this.GetVenueImages();
    }

    GetVenueImages()
    {
        this.WaitBeforeLoading(
        () => this.main.imagesService.GetAccountImages(this.VenueId,{limit:5}),
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
            this.onError.emit("Media form invalid");
            return;
        }
        this.onSaveVenue.emit(this.Venue);
    }

    loadImage($event:any):void
    {
        let target = $event.target;
        if(target.files.length == 0)
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
        if(this.ImageToLoad.image_type != "other" && this.ImageToLoad.image_type_description)
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
                this.onError.emit(BaseMessages.Fail);
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
                    this.VenueImages.findIndex( obj => obj.id == image.id),
                    1
                );
                this.GetVenueImages();
            },
            (err) => {
                this.onError.emit(BaseMessages.Fail);
            }
        );
    }
}
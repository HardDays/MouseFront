import { Component, Input, OnInit, ElementRef, EventEmitter, ViewChild, NgZone, Output, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { ContactModel } from '../../../core/models/contact.model';
import { Base64ImageModel } from '../../../core/models/base64image.model';
import {BaseMessages} from '../../../core/base/base.enum';

declare var $:any;

@Component({
    selector: 'venue-about-selector',
    templateUrl: './about.component.html',
    styleUrls: [
        './../venueCreate.component.css',
        './about.component.css'
    ]
})
export class VenueAboutComponent extends BaseComponent implements OnInit,OnChanges {
    @Input() VenueImageId: number;
    @Input() Venue: AccountCreateModel;
    @Input() VenueId: number;
    @Output() onSaveVenue:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();
    @Output() onError:EventEmitter<string> = new EventEmitter<string>();
    @Output() onImageDeleted:EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onVenueChanged:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();

    phoneMask:string='';

    EmailFormGroup : FormGroup = new FormGroup({
        "name_email":new FormControl("",[]),
        "email":new FormControl("",[Validators.email]),
    });

    aboutForm : FormGroup = new FormGroup({
        "venue_name": new FormControl("", [Validators.required]),
        "mouse_name": new FormControl("", [Validators.required]),
        "short_desc": new FormControl("", [Validators.required,
                                        Validators.maxLength(1000)]),
        "phone": new FormControl("", [
            Validators.required,
            Validators.pattern(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/)
        ]),
        "fax": new FormControl("", []),
        "emails": new FormArray([]),
        "country": new FormControl("", [Validators.required]),
        "address": new FormControl("", [Validators.required]),
        "city": new FormControl("", [Validators.required]),
        "state": new FormControl("", [Validators.required]),
        "zipcode": new FormControl("", []),
    });

    CreateOnModelChangeForParent()
    {
        this.aboutForm.valueChanges.forEach(
            (value:any) => {
                this.onVenueChanged.emit(this.Venue);
                this.phoneMask = this.Venue.phone;
            });
        this.aboutForm.controls["emails"].valueChanges.forEach(
            (value:any) => {
                this.onVenueChanged.emit(this.Venue);
            }
        );
    }

    ngOnInit(): void
    {
        this.CreateOnModelChangeForParent();
        this.Init();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.Venue){
            this.Venue = changes.Venue.currentValue;
        }
        if(changes.VenueImageId)
            this.VenueImageId = changes.VenueImageId.currentValue;
        if(changes.VenueId)
            this.VenueId = changes.VenueId.currentValue;
        this.Init();
    }

    Init()
    {
        this.CreateLocalAutocomplete();

        this.aboutForm.controls["emails"] = new FormArray([]);

        if(!this.Venue.emails)
            this.Venue.emails = [new ContactModel()];

        this.AddEmailsToForm(this.Venue.emails.length);
        this.GetVenueImage();

        this.phoneMask = this.Venue.phone;
    }

    GetVenueImage()
    {
        if(this.VenueImageId)
        {
            this.main.imagesService.GetImageById(this.VenueImageId)
                .subscribe(
                    (res:Base64ImageModel) => {
                        this.Venue.image_base64 = res.base64;
                        this.onVenueChanged.emit(this.Venue);
                    }
                );
        }
    }

    CreateLocalAutocomplete()
    {
        this.CreateAutocomplete(
            (addr,place) => {

                if(place)
                {
                    this.Venue.address = place.formatted_address;
                    //this.Venue.lat = place.geometry.location.toJSON().lat;
                    //this.Venue.lng = place.geometry.location.toJSON().lng;
                }
                setTimeout(() => {


                for(let a of addr)
                {

                    if(a.search('locality') > 0)
                    {
                        this.Venue.city = a.slice(a.search('>')+1,a.search('</'));
                    }
                    else if(a.search('street-address') > 0)
                    {
                        this.Venue.address = a.slice(a.search('>')+1,a.search('</'));
                    }
                    else if(a.search('region') > 0)
                    {
                        this.Venue.state = a.slice(a.search('>')+1,a.search('</'));
                    }
                    else if(a.search('country-name') > 0)
                    {
                        this.Venue.country = a.slice(a.search('>')+1,a.search('</'));
                    }
                    else if(a.search('postal-code') > 0)
                    {
                        this.Venue.zipcode = a.slice(a.search('>')+1,a.search('</'));
                    }
                }
                }, 400);
            }
        );
    }

    AddEmailsToForm(count?:number)
    {
        let n = 1;
        if(count)
            n = count;

        for(let i = 0; i < n; i++ )
        {
        (<FormArray>this.aboutForm.controls["emails"]).push(this.GetContactFormGroup());
        }
    }

    GetContactFormGroup()
    {
        return new FormGroup({
            "name_email":new FormControl("",[Validators.required]),
            "email":new FormControl("",[Validators.email, Validators.required]),
        })
    }

    AddEmail()
    {
        this.Venue.emails.push(new ContactModel());
        (<FormArray>this.aboutForm.controls["emails"]).push(this.GetContactFormGroup());
    }

    DeleteEmail(index:number)
    {
        (<FormArray>this.aboutForm.controls["emails"]).removeAt(index);
        this.Venue.emails.splice(index,1);
    }

    SaveVenue()
    {


        this.aboutForm.updateValueAndValidity();
        if(this.aboutForm.invalid)
        {
            this.onError.emit(this.getFormErrorMessage(this.aboutForm, 'venue'));
            return;
        }

        $('html,body').animate({
            scrollTop: 0
        }, 0);

        let phoneToSend = this.ConvertPhoneToCountry(this.Venue.phone);
        phoneToSend = phoneToSend.replace(/ /g,'');
        phoneToSend = phoneToSend.replace(/\(/g,'');
        phoneToSend = phoneToSend.replace(/\)/g,'');
        phoneToSend = phoneToSend.replace(/-/g,'');
        this.Venue.phone =  phoneToSend;

        // console.log(this.Venue);
        this.onSaveVenue.emit(this.Venue);
    }

    uploadImage($event){
        this.ReadImages(
            $event.target.files,
            (res:string)=>{
                this.Venue.image_base64 = res;
            }
        );
    }

    DeleteImage()
    {
        if(this.VenueImageId && this.VenueId && this.Venue.image_base64)
        {
            this.main.imagesService.DeleteImageById(this.VenueImageId,this.VenueId)
                .subscribe(
                    (res) => {
                        this.VenueImageId = 0;
                        this.onImageDeleted.emit(true);
                        this.DeleteLocalImage();
                    }
                );
        }
        else {
            this.DeleteLocalImage();
        }
    }

    DeleteLocalImage()
    {
        this.Venue.image_base64='';
        this.onVenueChanged.emit(this.Venue);
    }
}

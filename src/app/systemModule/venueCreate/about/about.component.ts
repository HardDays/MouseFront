import { Component, Input, OnInit, ElementRef,EventEmitter, ViewChild, NgZone, Output } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { ContactModel } from '../../../core/models/contact.model';


@Component({
    selector: 'venue-about-selector',
    templateUrl: './about.component.html',
    styleUrls: ['./../venueCreate.component.css']
})
export class VenueAboutComponent extends BaseComponent implements OnInit {
    @Input() Venue: AccountCreateModel;
    @Output() onSaveVenue:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();
    @Output() onError:EventEmitter<string> = new EventEmitter<string>();


    EmailFormGroup : FormGroup = new FormGroup({
        "name_email":new FormControl("",[]),
        "email":new FormControl("",[Validators.email]),
    });

    aboutForm : FormGroup = new FormGroup({        
        "venue_name": new FormControl("", [Validators.required]),
        "mouse_name": new FormControl("", [Validators.required]),
        "short_desc": new FormControl("", [Validators.required]),
        "phone": new FormControl("", [Validators.required]),
        "fax": new FormControl("", []),
        "emails": new FormArray([]),
        "country": new FormControl("", [Validators.required]),
        "address": new FormControl("", [Validators.required]),
        "city": new FormControl("", [Validators.required]),
        "state": new FormControl("", [Validators.required]),
        "zipcode": new FormControl("", []),
    });
    
    ngOnInit(): void 
    {
        this.CreateLocalAutocomplete();

        this.aboutForm.controls["emails"] = new FormArray([]);

        if(!this.Venue.emails)
            this.Venue.emails = [new ContactModel()];
        
        this.AddEmailsToForm(this.Venue.emails.length);
        
        
    }

    CreateLocalAutocomplete()
    {
        this.CreateAutocomplete(
            (addr,place) => {
                if(place)
                {
                    this.Venue.address = place.formatted_address;     
                }  
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
        "name_email":new FormControl("",[]),
        "email":new FormControl("",[Validators.email]),
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
           // console.log(this.aboutForm);
            this.onError.emit("About form invalid");
            return;
        }
        this.onSaveVenue.emit(this.Venue);
    }
}
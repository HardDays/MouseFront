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
import {BaseMessages} from '../../../core/base/base.enum';


@Component({
    selector: 'venue-listing-selector',
    templateUrl: './listing.component.html',
    styleUrls: ['./../venueCreate.component.css']
})
export class VenueListingComponent extends BaseComponent implements OnInit,OnChanges {
    @Input() Venue: AccountCreateModel;
    @Output() onSaveVenue:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();
    @Output() onError:EventEmitter<string> = new EventEmitter<string>();
    @Output() onVenueChanged:EventEmitter<AccountCreateModel> = new EventEmitter<AccountCreateModel>();

    TypesOfSpace:SelectModel[] = [];
    LocatedTypes:SelectModel[] = [];

    detailsForm : FormGroup = new FormGroup({
        "venue_type": new FormControl("", [Validators.required]),
        "other_venue": new FormControl("",[]),
        "capacity": new FormControl("",[Validators.required,
            Validators.pattern("[0-9]+"),
            Validators.min(0),Validators.max(150000)
        ]),
        "bathrooms": new FormControl("",[
            Validators.pattern("[0-9]+"),
            Validators.min(0),Validators.max(100)
        ]),
        "min_age": new FormControl("",[
            Validators.pattern("[0-9]+"),
            Validators.min(0),Validators.max(25)
        ]),
        "bar": new FormControl("",[]),
        "located":new FormControl("",[]),
        "dress_code":new FormControl("Shirt and Shoes Required",[])
    });

    CreateOnModelChangeForParent()
    {
        this.detailsForm.valueChanges.forEach(
            (value:any) => {
                this.onVenueChanged.emit(this.Venue);
            });
    }

    ngOnInit(): void
    {
        this.TypesOfSpace = this.main.typeService.GetAllSpaceTypes();
        this.LocatedTypes = this.main.typeService.GetAllLocatedTypes();
        this.CreateOnModelChangeForParent();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.Venue = changes.Venue.currentValue;
    }


    SaveVenue()
    {
        this.detailsForm.updateValueAndValidity();
        if(this.detailsForm.invalid)
        {
            this.onError.emit(this.getFormErrorMessage(this.detailsForm, 'venue'));
            return;
        }


        if(this.Venue.type_of_space != "other" && this.Venue.other_genre_description)
        {
            this.Venue.other_genre_description = "";
        }
        this.onSaveVenue.emit(this.Venue);
    }

    GetCapacityMask(int:number)
    {
        let str = int?int.toString():"";

        let mask = [/[1-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/,/[0-9]/];

        if( str && str.length > 4)
        {
        if(+str.substr(0,5) > 19999)
            mask.splice(5,1);
        }

        return {
        mask: mask,
        keepCharPositions: true,
        guide:false
        };
    }

    GetAgeMask(int:number)
    {
        let str = int?int.toString():"";
        let mask = [/[0-2]/,(str && +str[0] > 1)?/[0-5]/:/[0-9]/];

        if(str && +str[0] == 0)
        mask.splice(1,1);

        return {
        mask: mask,
        keepCharPositions: true,
        guide:false
        };
    }

    GetNumOfBathrooms(int:number)
    {
        let str = int?int.toString():"";
        let mask = [/[0-9]/,/[0-9]/];

        if(str && +str[0] == 0)
        mask.splice(1,1);

        return {
        mask: mask,
        keepCharPositions: true,
        guide:false
        };
    }
}

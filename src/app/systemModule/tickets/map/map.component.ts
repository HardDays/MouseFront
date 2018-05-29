import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { EventSearchParams } from '../../../core/models/eventSearchParams';
import { GenreModel } from '../../../core/models/genres.model';
import { CheckModel } from '../../../core/models/check.model';
import { SelectModel } from '../../../core/models/select.model';
import { NgForm } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { EventSearchModel } from '../../../core/models/eventSearch.model';

declare var $:any;
declare var ionRangeSlider:any;

@Component({
    selector: 'search-tickets-map-cmp',
    templateUrl: './map.component.html',
    styleUrls: ['./../tickets.component.css']
})
export class SearchTicketsMapComponent extends BaseComponent implements OnInit {
    
    lat:number;
    lng:number;
    @Output() onMapClicked:EventEmitter<any> = new EventEmitter<any>();

    isMarkerVisible: boolean = false;
    ngOnInit(): void 
    {
        this.lat = 55.755826;
        this.lng = 37.6172999;
    }

    AboutOpenMapModal(searchParams:any)
    {
       // console.log(searchParams);
        this.lat = 55.755826;
        this.lng = 37.6172999;
        this.isMarkerVisible = false;
        if(searchParams.lat && searchParams.lng)
        {
            this.lat = searchParams.lat;
            this.lng = searchParams.lng;
            this.isMarkerVisible = true;
        }

        $('#modal-map').modal('show');
    }

    MapClick($event)
    {
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;
        this.isMarkerVisible = true;
        this.CodeLatLng(this.lat,this.lng);
    }

    CodeLatLng(lat, lng) 
    {
        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode(
            {'location': latlng }, 
            (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[1]) 
                    {
                        this.onMapClicked.emit(
                            {
                                lat: this.lat,
                                lng: this.lng,
                                text: results[1].formatted_address
                            }
                        );
                    }
                } 
                else {
                    alert('Geocoder failed due to: ' + status);
                }
            }
        );
    }

    AboutDragMarker($event)
    {
        this.lat = $event.coords.lat;
        this.lng = $event.coords.lng;
        this.CodeLatLng( this.lat, this.lng);
    }
}
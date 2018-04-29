import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { EventSearchParams } from '../../../core/models/eventSearchParams';
import { GenreModel } from '../../../core/models/genres.model';
import { CheckModel } from '../../../core/models/check.model';
import { SelectModel } from '../../../core/models/select.model';
import { NgForm } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';

declare var $:any;
declare var ionRangeSlider:any;

@Component({
    selector: 'map-event-selector',
    templateUrl: './map.component.html',
    styleUrls: ['./../events.component.css']
})
export class MapEventComponent extends BaseComponent implements OnInit {
    lat:number;
    lng:number;
    @Output() onMapClicked:EventEmitter<any> = new EventEmitter<any>();

    isMarkerVisible: boolean = false;
    ngOnInit(): void 
    {
        this.lat = 0;
        this.lng = 0;
    }

    AboutOpenMapModal(searchParams:EventSearchParams)
    {
        this.lat = 0;
        this.lng = 0;
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

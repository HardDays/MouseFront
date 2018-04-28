import { Component, Input, OnInit } from '@angular/core';
import { EventGetModel } from '../../core/models/eventGet.model';
import { BaseComponent } from '../../core/base/base.component';
import { BaseImages } from '../../core/base/base.enum';
import { Base64ImageModel } from '../../core/models/base64image.model';


@Component({
    selector: 'my-event-selector',
    templateUrl: './myEvent.component.html',
    styleUrls: ['./myEvent.component.css']
})
export class MyEventComponent extends BaseComponent implements OnInit {
    @Input() Event: EventGetModel;
    FoundedPercent:number = 0;
    Image:string = BaseImages.Drake;

    ngOnInit(): void 
    {
        this.GetExtendedEvent();
    }

    GetExtendedEvent()
    {
        // console.log(this.Event);
        this.WaitBeforeLoading(
            () => this.main.eventService.GetEventById(this.Event.id),
            (res:EventGetModel) =>{
                this.Event = res;
                this.FoundedPercent = 100*this.Event.founded / this.Event.funding_goal;
                this.GetImage();
            },
            (err) => {
                // console.log(err);
            }
        );
    }

    GetImage()
    {
        if(this.Event && this.Event.image_id)
        {
            this.WaitBeforeLoading(
                () => this.main.imagesService.GetImageById(this.Event.image_id),
                (res:Base64ImageModel) => {
                    this.Image = (res && res.base64) ? res.base64 : BaseImages.Drake;
                }
            );
        }
    }
}
import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { EventGetModel } from '../../../core/models/eventGet.model';
import { BaseImages } from '../../../core/base/base.enum';
import { Base64ImageModel } from '../../../core/models/base64image.model';


@Component({
    selector: 'my-event-selector',
    templateUrl: './myEvent.component.html',
    styleUrls: [ './../events.component.css']
})
export class MyEventComponent extends BaseComponent implements OnChanges {
    @Input() Event: EventGetModel;
    
    @Output() onGetAnalytics:EventEmitter<EventGetModel> = new EventEmitter<EventGetModel>();
    FoundedPercent:number = 0;
    Image:string = BaseImages.Drake;

    ngOnChanges(changes: SimpleChanges): void 
    {
        this.GetExtendedEvent();
    }

    GetExtendedEvent()
    {
        if(this.Event && this.Event.id){
            this.main.eventService.GetEventById(this.Event.id)
            .subscribe(
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
    }

    GetImage()
    {
        if(this.Event && this.Event.image_id)
        {
            this.main.imagesService.GetImageById(this.Event.image_id)
                .subscribe(
                    (res:Base64ImageModel) => {
                        this.Image = (res && res.base64) ? res.base64 : BaseImages.Drake;
                    }
                );
        }
    }

    AnaliticsClick(e)
    {
        e.stopPropagation();
        this.onGetAnalytics.emit(this.Event);
    }
}
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { EventGetModel } from '../../../core/models/eventGet.model';
import { BaseImages } from '../../../core/base/base.enum';
import { Base64ImageModel } from '../../../core/models/base64image.model';

declare var $:any;
@Component({
    selector: 'analyt-event-selector',
    templateUrl: './analytics.component.html',
    styleUrls: [ './../events.component.css']
})
export class AnalyticsEventComponent extends BaseComponent {
    Event: EventGetModel = new EventGetModel();
    FoundedPercent:number = 0;
    Image:string = BaseImages.Drake;
    DaysToGo:number = 0;
    Analyt:any = {};

    ShowWindow(event:EventGetModel)
    {
        this.Event = event;
        this.FoundedPercent = 100*this.Event.founded / this.Event.funding_goal;
        this.GetData();
    }


    GetData()
    {
        this.GetImage();
        if(this.Event.id)
        {
            this.main.eventService.GetEventAnalytics(this.Event.id)
                .subscribe(
                    res => {
                        this.Analyt = res;
                        this.OpenWindow();
                    }
                );
        }
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

    OpenWindow()
    {
        $('#modal-analytics').modal('show');
    }
}
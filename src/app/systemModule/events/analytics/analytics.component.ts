import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { EventGetModel } from '../../../core/models/eventGet.model';
import { BaseImages } from '../../../core/base/base.enum';
import { Base64ImageModel } from '../../../core/models/base64image.model';
import { CurrencyIcons, Currency } from '../../../core/models/preferences.model';

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
    EventCurrency = CurrencyIcons[Currency.USD];
    Date = "";
    EventLocation = "";

    
    isPrint = false;
    
    ShowWindow(event:EventGetModel)
    {
        this.Event = event;
        this.FoundedPercent = 100*this.Event.founded / this.Event.funding_goal;
        this.EventCurrency = CurrencyIcons[this.Event.currency];
        this.Date = this.main.typeService.GetEventDateString(this.Event);
        this.EventLocation = EventGetModel.GetEventLocation(this.Event);
        if(this.Event.is_crowdfunding_event)
        {
            this.DaysToGo = EventGetModel.GetDaysToGo(this.Event);
        }
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
            this.main.imagesService.GetImageById(this.Event.image_id)
                .subscribe(
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

    printAnalytics(){

        // var originalContents = document.body.innerHTML;
        this.isPrint = true;
        setTimeout(() => {
            let printContent = document.getElementById('modal-analytics').innerHTML;
            let popupWin = window.open('','_blank', 'top=0,left=0,height=100%,width=auto');

            var css = '@page { size: portrait; }';
            var style = document.createElement('style');

            style.type = 'text/css';
            style.media = 'print';

            if (style['styleSheet']){
            style['styleSheet'].cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            popupWin.document.write(`
            <html>
                <head>
                <title>Print tab</title>
                <style>
                ${style}
                </style>
                </head>
            <body onload="window.print();window.close()">${printContent}</body>
            </html>`
            );
            popupWin.document.close();
         
         setTimeout(() => {
            this.isPrint = false;
          }, 100);
        //  document.body.innerHTML = originalContents;
        }, 100);
        
    
      }
}
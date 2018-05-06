import { Component, Input, OnInit } from '@angular/core';

import { BaseComponent } from '../../../core/base/base.component';
import { BaseImages } from '../../../core/base/base.enum';
import { Base64ImageModel } from '../../../core/models/base64image.model';
import { TicketsGetModel } from '../../../core/models/ticketsGetModel';

@Component({
  selector: 'app-ticket-on-profile',
  templateUrl: './ticket-on-profile.component.html',
  styleUrls: ['./ticket-on-profile.component.css']
})
export class TicketOnProfileComponent extends BaseComponent implements OnInit{

    @Input() Ticket: TicketsGetModel;
    FoundedPercent:number = 0;
    Image:string = BaseImages.Drake;

    ngOnInit(): void  
    {
        this.GetImage();
    }

    GetImage()
    {
        if(this.Ticket && this.Ticket.image_id)
        {
            this.main.imagesService.GetImageById(this.Ticket.image_id)
                .subscribe(
                    (res:Base64ImageModel) => {
                        this.Image = (res && res.base64) ? res.base64 : BaseImages.Drake;
                    }
                );
        }
    }

}

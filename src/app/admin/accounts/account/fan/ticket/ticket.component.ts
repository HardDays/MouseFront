import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../../../core/base/base.component';
import { TicketsGetModel } from '../../../../../core/models/ticketsGetModel';
import { BaseImages } from '../../../../../core/base/base.enum';
import { Base64ImageModel } from '../../../../../core/models/base64image.model';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent extends BaseComponent implements OnInit{

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

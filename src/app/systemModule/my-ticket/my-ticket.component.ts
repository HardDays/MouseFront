import { Component, Input, OnInit } from '@angular/core';

import { BaseComponent } from '../../core/base/base.component';
import { BaseImages } from '../../core/base/base.enum';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { TicketsGetModel } from '../../core/models/ticketsGetModel';

@Component({
  selector: 'app-my-ticket',
  templateUrl: './my-ticket.component.html',
  styleUrls: ['./my-ticket.component.css']
})
export class MyTicketComponent extends BaseComponent implements OnInit {

  @Input() Ticket: TicketsGetModel;
  FoundedPercent:number = 0;
  Image:string;

  ngOnInit(): void 
  {
      this.GetImage();
  }


  GetImage()
  {
      if(this.Ticket && this.Ticket.image_id)
      {
          this.WaitBeforeLoading(
              () => this.imgService.GetImageById(this.Ticket.image_id),
              (res:Base64ImageModel) => {
              
                  this.Image = (res && res.base64) ? res.base64 : BaseImages.Drake;
              },
              (err) =>{
                  this.Image = BaseImages.Drake;
              }
          );
      }
      else{
          this.Image = BaseImages.Drake;
      }
  }
}

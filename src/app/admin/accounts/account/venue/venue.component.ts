import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../../core/base/base.component';
import { AccountGetModel } from '../../../../core/models/accountGet.model';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent extends BaseComponent implements OnInit {

  @Input() Account:AccountGetModel;

  ngOnInit() {
  }

}

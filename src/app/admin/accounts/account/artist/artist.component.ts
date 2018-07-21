import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../../core/base/base.component';
import { AccountGetModel } from '../../../../core/models/accountGet.model';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent extends BaseComponent implements OnInit {

  @Input() Account:AccountGetModel;

  ngOnInit() {
  }

}

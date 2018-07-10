import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent extends BaseComponent implements OnInit {

  @Input() isApprovedBy;
  @Input() status;

  ngOnInit() {
  }

  openArtist(){
    this.router.navigate(["/admin",'account',1])
  }
}

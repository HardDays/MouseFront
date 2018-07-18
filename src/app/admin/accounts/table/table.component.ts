import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { AccountGetModel } from '../../../core/models/accountGet.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent extends BaseComponent implements OnInit {

  @Input() isApprovedBy;
  @Input() status;
  @Input() Accounts:AccountGetModel;
  @Input() Events:any;

  ngOnInit() {
    console.log(this.Accounts)
  }

  openArtist(){
    this.router.navigate(["/admin",'account',1])
  }
}

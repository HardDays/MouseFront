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
  @Input() Accounts:AccountGetModel[];
  @Input() Events:any[];

  openIds:number[] = [];

  ngOnInit() {
    // console.log(this.Accounts)
  }

  openAccount(id:number){
    this.router.navigate(["/admin",'account',id])
  }

  openEvent(id:number){
    this.router.navigate(["/admin",'event',id])
  }

  checkIdToOpen(id:number){
    let index = this.openIds.indexOf(id);
    if(index<0)
      this.openIds.push(id);
    else
      this.openIds.splice(index,1);
    
      // console.log(this.openIds);

  }

  openInNewTabs(){
    let type = this.Accounts?'account':this.Events?'event':'';
    for(let id of this.openIds){
        // window.open('http://localhost:4200/admin/'+type+'/'+id,'_blank');
        window.open('http://mouse-web.herokuapp.com/admin/'+type+'/'+id,'_blank');
        window.blur();
      }
  }

}

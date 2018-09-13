import { Component, OnInit, Input } from "@angular/core";
import { BaseComponent } from "../../../core/base/base.component";
import { AccountGetModel } from '../../../core/models/accountGet.model';

@Component({
    selector: 'accounts-full-search-component',
    templateUrl: './accounts-full.component.html',
    styleUrls: ['./../search.component.css']
  })
  
  export class AccountsFullSearchComponent extends BaseComponent implements OnInit {
    @Input() Label:string;
    @Input() Accounts: AccountGetModel[];
    ngOnInit(): void 
    {
    }

    
  }
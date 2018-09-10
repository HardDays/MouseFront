import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from "../../../core/base/base.component";
import { AccountGetModel } from '../../../core/models/accountGet.model';

@Component({
    selector: 'accounts-search-component',
    templateUrl: './accounts.component.html',
    styleUrls: ['./../search.component.css']
  })
  
  export class AccountsSearchComponent extends BaseComponent implements OnInit, OnChanges {
    
    @Input() Accounts: AccountGetModel[];
    @Input() AccountType: string;
    @Output() ShowFullAccounts: EventEmitter<string> = new EventEmitter<string>();
    ngOnInit(): void {
        
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    ShowAll()
    {
        this.ShowFullAccounts.emit(this.AccountType);
    }
  }
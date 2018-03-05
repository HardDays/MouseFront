import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';
import { AuthService } from "angular2-social-login";
import { BaseComponent } from '../../core/base/base.component';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { AccountSearchParams } from '../../core/models/accountSearchParams.model';
import { SelectModel } from '../../core/models/select.model';
import { Base64ImageModel } from '../../core/models/base64image.model';

declare var $:any;

@Component({
  selector: 'shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.css']
})


export class ShowsComponent extends BaseComponent implements OnInit {

  SearchParams: AccountSearchParams = new AccountSearchParams();
  AccountTypes:SelectModel[] = [];
  Accounts:AccountGetModel[] = [];
  Images:string[] = [];

  ngOnInit(){
    this.AccountTypes = this.typeService.GetAllAccountTypes();
    this.GetAccounts();

  }

  GetAccounts()
  {
    this.accService.AccountsSearch(this.SearchParams)
    .subscribe((res:AccountGetModel[])=>{
      this.Accounts = res;
      console.log(this.Accounts);
    })
  }

  GetImages()
  {
    this.Images = [];
    for(let item of this.Accounts)
    {
      this.Images[item.id] = "";
      if(item.image_id)
      {
        this.imgService.GetImageById(item.image_id)
          .subscribe((res:Base64ImageModel)=>{
            this.Images[item.id] = res.base64;
          })
      }
    }

  }
  
}

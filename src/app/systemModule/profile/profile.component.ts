
import { OnInit, Component } from "@angular/core";
import { BaseComponent } from "../../core/base/base.component";
import { AccountCreateModel } from "../../core/models/accountCreate.model";
import { Base64ImageModel } from "../../core/models/base64image.model";



@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
  })

export class ProfileComponent extends BaseComponent implements OnInit {
    UserId:number;
    Account:AccountCreateModel = new AccountCreateModel();

    ngOnInit()
    {
      this.accService.GetMyAccount({extended:true})
        .subscribe((user:any[])=>{
            console.log("GET", user);
            this.InitByUser(user[0]);
        })
      
    }
   
  
    InitByUser(usr:any){
      this.Account = this.accService.AccountModelToCreateAccountModel(usr);
      if(usr.image_id){
          this.imgService.GetImageById(this.UserId, usr.image_id)
              .subscribe((res:Base64ImageModel)=>{
                  this.Account.image_base64 = res.base64;
              });
      }

  }
}
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { UserCreateModel } from '../../../core/models/userCreate.model';
import { ErrorComponent } from '../../../shared/error/error.component';
import { BaseMessages } from '../../../core/base/base.enum';

@Component({
  selector: 'app-add-new-admin',
  templateUrl: './add-new-admin.component.html',
  styleUrls: ['./add-new-admin.component.css']
})
export class AddNewAdminComponent extends BaseComponent implements OnInit {

  @ViewChild('errCmp') errCmp:ErrorComponent;
  
  newUser: UserCreateModel = new UserCreateModel();

  ngOnInit() {
  }

  createUser(){
    this.main.adminService.CreateAdmin(this.newUser)
      .subscribe(
        (res)=>{
          // console.log(res);
          this.errCmp.OpenWindow(BaseMessages.Success);
        },
        (err)=>{
          // console.log(`err`,err);
          this.errCmp.OpenWindow(this.getResponseErrorMessage(err))
        }
      )
  }

  loadLogo($event:any):void
  {
    this.ReadImages(
        $event.target.files,
        (res:string)=>
        {
            this.newUser.image_base64 = res;
        }
    );
  }

}

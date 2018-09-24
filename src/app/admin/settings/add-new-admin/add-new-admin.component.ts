import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { UserCreateModel } from '../../../core/models/userCreate.model';
import { ErrorComponent } from '../../../shared/error/error.component';
import { BaseMessages } from '../../../core/base/base.enum';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-new-admin',
  templateUrl: './add-new-admin.component.html',
  styleUrls: ['./add-new-admin.component.css']
})
export class AddNewAdminComponent extends BaseComponent implements OnInit {

  @ViewChild('errCmp') errCmp:ErrorComponent;
  
  newUser: UserCreateModel = new UserCreateModel();

  userForm : FormGroup = new FormGroup({
    "first_name": new FormControl("", [Validators.required]),
    "last_name": new FormControl("", [Validators.required]),
    "user_name": new FormControl("", [Validators.required]),
    "email": new FormControl(),
    "password": new FormControl(),
    "password_confirmation": new FormControl(),
    "register_phone": new FormControl(),
    "country": new FormControl(),
    "city": new FormControl(),
    "address": new FormControl(),
    "state": new FormControl(),
    "address_other": new FormControl()
  });

  ngOnInit() {
  }

  createUser(){
    if(!this.userForm.invalid){
      this.main.adminService.CreateAdmin(this.newUser)
        .subscribe(
          (res)=>{
            // console.log(res);
            this.userForm.reset();
            this.errCmp.OpenWindow(BaseMessages.Success);
          },
          (err)=>{
            // console.log(`err`,err);
            this.errCmp.OpenWindow(this.getResponseErrorMessage(err))
          }
        )
    }
    else{
      this.errCmp.OpenWindow(BaseMessages.Fail);
    }
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

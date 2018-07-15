import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { UserCreateModel } from '../../../core/models/userCreate.model';

@Component({
  selector: 'app-add-new-admin',
  templateUrl: './add-new-admin.component.html',
  styleUrls: ['./add-new-admin.component.css']
})
export class AddNewAdminComponent extends BaseComponent implements OnInit {

  newUser: UserCreateModel = new UserCreateModel();

  ngOnInit() {
  }

  createUser(){
    this.main.adminService.CreateAdmin(this.newUser)
      .subscribe(
        (res)=>{
          console.log(res);
        },
        (err)=>{
          console.log(`err`,err);
        }
      )
  }

}

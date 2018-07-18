import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { UserGetModel } from '../../core/models/userGet.model';
import { UserCreateModel } from '../../core/models/userCreate.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent extends BaseComponent implements OnInit {

  User: UserCreateModel = new UserCreateModel();

  ngOnInit() {
    this.User = this.main.MyUser;
    
    console.log(this.User)
    // if(this.User.image_id){
    //   this.main.imagesService.GetImageById(this.User.image_id)
    //     .subscribe((res)=>{
    //       console.log(`res img`, res);
    //       this.User.image_base64 = res.base64;
    //     })
    // }
  }

  SaveUser(){
    // console.log(`save user`,this.User);
    this.main.authService.UpdateUser(this.User)
      .subscribe(
          (res)=>{
              // this.User = res;
              // if(this.User.image_id){
              //   this.main.imagesService.GetImageById(this.User.image_id)
              //     .subscribe((res)=>{
              //       console.log(`res img`, res);
              //       this.User.image_base64 = res.base64;
              //     })
              // }
              // this.errorCmp.OpenWindow(BaseMessages.Success);
              console.log(`res`,this.User);
              this.main.GetMyUser();
              this.User = this.main.MyUser;
              
          },
          (err)=>{
              console.log(`err`,err);
              //this.errorCmp.OpenWindow(this.getResponseErrorMessage(err));
          }
      );
  }

  loadLogo($event:any):void
  {
    this.ReadImages(
        $event.target.files,
        (res:string)=>
        {
            this.User.image_base64 = res;
        }
    );
  }
}

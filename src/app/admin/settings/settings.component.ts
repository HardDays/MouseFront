import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { UserGetModel } from '../../core/models/userGet.model';
import { UserCreateModel } from '../../core/models/userCreate.model';
import { ErrorComponent } from '../../shared/error/error.component';
import { BaseFields, BaseErrors, BaseMessages } from '../../core/base/base.enum';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent extends BaseComponent implements OnInit {

    User: UserCreateModel = new UserCreateModel();
    userId:number = 0;

    @ViewChild('errCmp') errCmp:ErrorComponent;

  ngOnInit() {


    this.main.adminService.GetMyAccByIdUser(this.main.MyUser.id)
        .subscribe(
            (res)=>{
                this.userId = res.id
                // console.log(this.User)
                this.User = res;
                console.log(this.User);

                if(this.User.image_id){
                this.main.imagesService.GetImageById(this.User.image_id)
                    .subscribe((res)=>{
                    console.log(`res img`, res);
                    this.User.image_base64 = res.base64;
                    })
                }

            }
        )
    // this.User = this.main.MyUser;
    
    
    
  }

  SaveUser(){
    console.log(`save user`,this.User);
    this.main.adminService.PatchAdmin(this.User, this.userId)
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
            //   console.log(`res`,this.User);
              this.main.GetMyUser();
              this.User = res;
              this.errCmp.OpenWindow(BaseMessages.Success);
              
          },
          (err)=>{
            //   console.log(`err`,err);
              this.errCmp.OpenWindow(this.getResponseErrorMessage(err));
          }
      );
    if(this.User.password){
        this.main.authService.UpdateUser(this.User)
            .subscribe(
                (res)=>{
                    // console.log(`pass update`);
                },
                (err)=>{
                    // console.log(`err`,err);
                    
                }
            )
    }
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

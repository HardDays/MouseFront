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
                // console.log(this.User);

                if(this.User.image_id){
                this.main.imagesService.GetImageById(this.User.image_id)
                    .subscribe((res)=>{
                    // console.log(`res img`, res);
                    this.User.image_base64 = res.base64;
                    })
                }

            }
        )
    // this.User = this.main.MyUser;



  }

  SaveUser(){
    // console.log(`save user`,this.User);
    let currentUser = this.User;
    this.main.adminService.PatchAdmin(this.User, this.userId)
      .subscribe(
          (res)=>{
              this.User = res;

              if(this.User.image_id){
                this.main.imagesService.GetImageById(this.User.image_id)
                  .subscribe((res)=>{
                    // console.log(`res img`, res);
                    this.User.image_base64 = res.base64;
                  })
              }
                console.log(currentUser);

                  if(currentUser.password){
                    console.log(`- User.password`);
                    // delete this.User['id']; // = this.main.MyUser.id
                    let user: UserCreateModel = new UserCreateModel();
                    user.password_confirmation = currentUser.password_confirmation;
                    user.password = currentUser.password;
                    this.main.authService.UpdateUser(user)
                        .subscribe(
                            (res)=>{
                              this.errCmp.OpenWindow(BaseMessages.Success);
                              setTimeout(() => {
                                if(this.errCmp.isShown)
                                  this.errCmp.CloseWindow();
                              this.main.GetMyUser();
                              }, 2000);
                                //  console.log(`pass update`);

                            },
                            (err)=>{

                              if(err.json()['password_confirmation']&&err.json()['password_confirmation'][0]==='NOT_MATCHED')
                                this.errCmp.OpenWindow(this.GetTranslateString('Fail! Password confirmation is not matched!'));
                              else if(err.json()['password']&&err.json()['password'][0]==='TOO_SHORT')
                                this.errCmp.OpenWindow(this.GetTranslateString('Fail! Password is too short!'));
                              else
                                this.errCmp.OpenWindow(this.getResponseErrorMessage(err));
                              //  console.log(`err12345`,err);
                                //  console.log(`err`,err);

                            }
                        )
                }
                else
                {
                  console.log(`! User.password`);
                  this.errCmp.OpenWindow(BaseMessages.Success);
            //   this.errorCmp.OpenWindow(BaseMessages.Success);
            //   console.log(`res`,this.User);
                  setTimeout(() => {
                      if(this.errCmp.isShown)
                        this.errCmp.CloseWindow();
                    this.main.GetMyUser();
                  }, 2000);
                }

              //this.User = res;


          },
          (err)=>{
              this.errCmp.OpenWindow(`!!!`+this.getResponseErrorMessage(err));
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

import { Component, ViewChild } from "@angular/core";
import { UserModel } from "../core/models/user.model";
import { MainService } from "../core/services/main.service";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Base64ImageModel } from "../core/models/base64image.model";




@Component({
  selector: 'app-edit-user',
  templateUrl: './editUser.component.html',
  styleUrls: ['./st-form.css']
})
export class EditUserComponent{
    RegistrationErr = false;
    isLoading = true;
    RegErrMsg = '';
    User = new UserModel();
    UserId:number = 0;
    image:any;
    oldEmail:string = '';
    constructor(private service: MainService, private router: Router) {
     }

    @ViewChild('submitFormUsr') form: NgForm;
    
    ngOnInit() 
    {
        this.service.GetMe()
            .subscribe((user:UserModel)=>{
                    this.InitByUser(user);
                    this.isLoading = false;
            })
        
    }

    InitByUser(usr:UserModel){
        // console.log(usr);
        // this.User = this.service.UserModelToCreateUserModel(usr);
        // this.oldEmail = usr.email?usr.email:'';
        // this.UserId = usr.id?usr.id:0;
        // if(usr.image_id){
        //     this.service.GetImageById(usr.image_id)
        //         .subscribe((res:Base64ImageModel)=>{
        //             this.User.image = res.base64;
        //         });
        // }
    }

    changeListener($event: any) : void {
        this.readThis($event.target);
      }
      
      readThis(inputValue: any): void {
        for(let f of inputValue.files){
            let file:File = f;
            if(!file) return;
            let myReader:FileReader = new FileReader();
            myReader.onloadend = (e) => {
                    this.image = myReader.result;
            }
            myReader.readAsDataURL(file);
        }
      }
}
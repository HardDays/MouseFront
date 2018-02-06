import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { UserModel } from "../../core/models/user.model";
import { MainService } from "../../core/services/main.service";
import { Base64ImageModel } from "../../core/models/base64image.model";




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

    InitByUser(res:any){
          this.service.GetImage(res.cover_id)
              .subscribe((res:Base64ImageModel)=>{
                  console.log("image");
                  console.log(res);
                  this.image = res.base64;
              });
       this.User.user_name = res.user_name?res.user_name:'';
        this.User.display_name = res.display_name?res.display_name:'';
        this.User.phone = res.phone?res.phone:'';
        this.User.bio = res.bio?res.bio:'';
        this.User.address = res.address?res.address:'';
        this.User.lat = res.lat?res.lat:'';
        this.User.lng = res.lng?res.lng:'';
      
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
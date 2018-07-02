import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { UserCreateModel } from '../../../core/models/userCreate.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ErrorComponent } from '../../../shared/error/error.component';
import { UserGetModel } from '../../../core/models/userGet.model';

@Component({
  selector: 'app-social-new-acc',
  templateUrl: './social-new-acc.component.html',
  styleUrls: ['./social-new-acc.component.css']
})
export class SocialNewAccComponent extends BaseComponent implements OnInit {

  @ViewChild('errorCmp') errorCmp: ErrorComponent;

  user:UserCreateModel = new UserCreateModel();
  type:string = 'fan';
  Error:string = '';
  isFirstOpen:boolean = true;

  userForm : FormGroup = new FormGroup({
      "email": new FormControl("", [Validators.required,
        Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')])
        //,"register_phone": new FormControl("")
    });

  ngOnInit(){

    // if(this.main.GetMyAccounts.length>0){
    //   this.router.navigate(['/system','shows']);
    // }
    
    this.user = this.main.MyUser;
    console.log(this.user);
    if(this.main.MyUser.email)
      this.router.navigate(['/system','shows']);
  }

  registerUser(){
    if(!this.userForm.invalid){
      console.log(`to back`, this.user);
      this.WaitBeforeLoading(       
        ()=>this.main.authService.UpdateUserWithoutPass(this.user),
        (res:UserGetModel) => {
          console.log(`res`,res);
            if(this.type=='venue')
              this.router.navigate(['/system','venueCreate','new']);
            else if(this.type=='artist')
              this.router.navigate(['/system','artistCreate','new']);
            else
              this.router.navigate(['/system','fanCreate','new']);
        },
        (err) => {
            console.log(`err`,err);
            if(err._body.indexOf("password")==0)
              this.errorCmp.OpenWindow(this.getResponseErrorMessage(err, 'base'));
            setTimeout(() => {
              if(this.errorCmp.isShown)
                this.errorCmp.CloseWindow();
              if(this.type=='venue')
                this.router.navigate(['/system','venueCreate','new']);
              else if(this.type=='artist')
                this.router.navigate(['/system','artistCreate','new']);
              else
                this.router.navigate(['/system','fanCreate','new']);
            }, 1000);
        });
    } else {
      this.errorCmp.OpenWindow('Error!');
    }

   
    
  }

  backTo(){
    this.Logout();
    // setTimeout(
    //   ()=>this.router.navigate(['/login']),1000
    // )
  }

}

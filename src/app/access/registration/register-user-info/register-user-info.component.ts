import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { invalid } from 'moment';
import { ErrorComponent } from '../../../shared/error/error.component';

@Component({
  selector: 'app-register-user-info',
  templateUrl: './register-user-info.component.html',
  styleUrls: ['./register-user-info.component.css']
})
export class RegisterUserInfoComponent extends BaseComponent implements OnInit {

  type:string = 'fan';
  @Output('createUser') backUser = new EventEmitter<string>();

  @ViewChild('errorCmp') errorCmp: ErrorComponent;
  
  image_base64:string = '';
  userForm : FormGroup = new FormGroup({
    "user_name": new FormControl("", [Validators.required]),
    "first_name": new FormControl("", [Validators.required]),
    "last_name": new FormControl("", [Validators.required])
  });
 

  ngOnInit() {
  }

  register(){

    if(!this.userForm.invalid)
      this.main.authService.UpdateUser({
          user_name: this.userForm.value['user_name'],
          last_name: this.userForm.value['last_name'],
          first_name: this.userForm.value['first_name'],
          image_base64: this.image_base64
        }).subscribe((res)=>{
            
            this.main.GetMyUser();

            if(this.type=='venue')
              this.router.navigate(['/system','venueCreate','new']);
            else if(this.type=='artist')
              this.router.navigate(['/system','artistCreate','new']);
            else
              this.backUser.emit('fan');

          }, (err)=>{
            this.errorCmp.OpenWindow(this.getResponseErrorMessage(err));
          })
    else {
      this.errorCmp.OpenWindow(this.getFormErrorMessage(this.userForm, 'base'));
    }
   
  }

  loadLogo($event:any):void
  {
    this.ReadImages(
        $event.target.files,
        (res:string)=>
        {
            this.image_base64 = res;
        }
    );
  }

}

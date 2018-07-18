import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { UserCreateModel } from '../../../core/models/userCreate.model';
import { UserGetModel } from '../../../core/models/userGet.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseComponent } from '../../../core/base/base.component';
import { ErrorComponent } from '../../../shared/error/error.component';
import { BaseMessages } from '../../../core/base/base.enum';
import { TokenModel } from '../../../core/models/token.model';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent extends BaseComponent implements OnInit {

  createUser:UserCreateModel = new UserCreateModel();
 
  Error:string = '';
  isFirstOpen:boolean = true;

 userForm : FormGroup = new FormGroup({
    "email": new FormControl("", [Validators.required,
      Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')]),
    "password": new FormControl("", [Validators.required]),
    "password_confirmation": new FormControl("", [Validators.required]),
    "register_phone": new FormControl("")
  });


  @Output('createUser') backUser = new EventEmitter<string>();
  @Output('back') back = new EventEmitter<string>();
  @Input('phoneInput') phone: string;
  @Input() isShowPhone: boolean = true;

  @ViewChild('errorCmp') errorCmp: ErrorComponent;

  type:string = 'fan';

  registerUser(){
    let isNew = true;
    if(!this.isFirstOpen){
      if(this.createUser.email!=this.userForm.value['email'])
      isNew = false;

      // if(!isNew){
      //   this.backUser.emit(this.type);
      // }
    }


    if(isNew&&this.userForm.valid){

      for (let key in this.userForm.value) {
        if (this.userForm.value.hasOwnProperty(key)) {
          if(this.userForm.value[key].length>0)
          this.createUser[key] = this.userForm.value[key];
        }
      }

      if(!this.createUser.email||!this.createUser.password)
        this.errorCmp.OpenWindow('Email and password are required fields!');
      else if (this.createUser.password.length<6)
        this.errorCmp.OpenWindow('Password is too short!');
      else if (this.createUser.password!=this.createUser.password_confirmation)
        this.errorCmp.OpenWindow('Password does not match the confirm password!');
      else if (this.createUser.email.search('@')<=0)
        this.errorCmp.OpenWindow('Uncorrect email!');
      else {

      this.createUser.email = this.createUser.email.toLowerCase();

      this.WaitBeforeLoading(
          ()=>this.main.authService.CreateUser(this.createUser),
          (res:UserGetModel) => {
              this.main.authService.BaseInitAfterLogin(new TokenModel(res.token));
              this.userCreated = true;
              this.main.authService.onAuthChange$.next(true);

              // this.back.emit('info');

              if(this.type=='fan')
                this.backUser.emit(this.type);
              else if(this.type=='venue')
                this.router.navigate(['/system','venueCreate','new']);
              else if(this.type=='artist')
                this.router.navigate(['/system','artistCreate','new']);


          },
          (err) => {
              this.errorCmp.OpenWindow(this.getResponseErrorMessage(err, 'base'));
          }
        );
      }
    }
     else{
       this.errorCmp.OpenWindow(this.getFormErrorMessage(this.userForm, 'base'));
     }
  }

  ngOnInit() {
    console.log(this.phone);
  }

  backPage(){
    this.back.emit('phone');
  }

}

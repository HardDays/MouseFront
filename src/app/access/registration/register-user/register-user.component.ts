import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UserCreateModel } from '../../../core/models/userCreate.model';
import { UserGetModel } from '../../../core/models/userGet.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseComponent } from '../../../core/base/base.component';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent extends BaseComponent implements OnInit {

  createUser:UserCreateModel = new UserCreateModel();
  type:string = 'fan';
  Error:string = '';
  isFirstOpen:boolean = true;

 userForm : FormGroup = new FormGroup({        
    "email": new FormControl("", [Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
    "password": new FormControl("", [Validators.required]),
    "password_confirmation": new FormControl("", [Validators.required]),
    "register_phone": new FormControl("")  
  });


  @Output('createUser') backUser = new EventEmitter<string>();
  @Output('back') back = new EventEmitter<string>();
  @Input('phoneInput') phone: string;
  @Input() isShowPhone: boolean = true;

  registerUser(){

    let isNew = true;
    if(!this.isFirstOpen){
     //console.log(`isFirstOpen`);
      if(this.createUser.email!=this.userForm.value['email']) 
      isNew = false;
        
      if(!isNew){
        //console.log(`not change`);
        this.backUser.emit(this.type);
      }
    }
      

    if(isNew&&this.userForm.valid){

      for (let key in this.userForm.value) {
        if (this.userForm.value.hasOwnProperty(key)) {
          if(this.userForm.value[key].length>0)
          this.createUser[key] = this.userForm.value[key];
        } 
      }

      if(!this.createUser.email||!this.createUser.password)
        this.Error = 'Entry fields email and password!';
      else if (this.createUser.password.length<6)
        this.Error = 'Short password!';
      else if (this.createUser.password!=this.createUser.password_confirmation)
        this.Error = 'Passwords not confirm!';
      else if (this.createUser.email.search('@')<=0)
        this.Error = 'Uncorrect email!';
      else {
      //console.log(this.createUser);
        this.CreateUser(this.createUser, ()=>{
                                          this.isFirstOpen = false;
                                          this.backUser.emit(this.type)
                                          }, (err)=>{
                                            //console.log(err);
                                            this.Error = err._body;
                                            
                                          });
      }
    }
     else{
       //console.log(`INVALID`);
       this.Error = 'Uncorrect inputs!';
     }
  }

  ngOnInit() {
    //console.log(`open`,this.isFirstOpen);
  }

  backPage(){
    this.back.emit('phone');
  }

}

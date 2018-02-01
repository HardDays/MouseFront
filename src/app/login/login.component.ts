import { Component } from '@angular/core';
import { NgForm} from '@angular/forms';
import { MainService } from '../core/services/main.service';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent {
  constructor(private service:MainService){}

  onSubmit(form: NgForm){
    console.log(form);
    this.service.Test().subscribe();
}
}

import { Component } from '@angular/core';
import { NgForm} from '@angular/forms';
import { BaseComponent } from '../core/base/base.component';

@Component({
  selector: 'stupidAccess',
  templateUrl: './stupidAccess.component.html'
})


export class StupidAccessComponent extends BaseComponent  {

  StupidAccess(form:NgForm){
    let pass = form.controls.access.value;
    if(pass=='dnkzspb123') {
      localStorage.setItem('access','true');
      this.router.navigate(['/system','shows']);
    }
  }

}

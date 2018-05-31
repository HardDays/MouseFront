import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { UserGetModel } from '../../../core/models/userGet.model';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit, OnChanges {

  @Input() User: UserGetModel;

  ngOnInit() {
  }
  ngOnChanges(){
  }
  

}

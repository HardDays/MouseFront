import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-new-users',
  templateUrl: './new-users.component.html',
  styleUrls: ['./new-users.component.css']
})
export class NewUsersComponent implements OnInit {

  @Input() Users:{created_at:string, value:number};
  constructor() { }

  ngOnInit() {

  }

}

import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../core/base/base.component';


@Component({
  selector: 'system-app',
  templateUrl: './system.component.html'
})
export class SystemComponent extends BaseComponent implements OnInit {

  // curPage:string = '';

  ngOnInit() {
    // this.curPage = this.router.url;
  }


}

import { BaseComponent } from './../../../core/base/base.component';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-open-message',
  templateUrl: './open-message.component.html',
  styleUrls: ['./open-message.component.css']
})
export class OpenMessageComponent extends BaseComponent implements OnInit {

  @Input() MessageId:number = 0;
  // constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.MessageId){
      this.MessageId = changes.MessageId.currentValue;
      this.openMessage();
    }
  }

  openMessage(){
    if(this.MessageId){
      this.main.adminService.GetMessagesById(this.MessageId)
        .subscribe((res)=>{
          console.log(`message`,res);
        })
    }
  }

}

import { BaseImages } from './../../../core/base/base.enum';
import { BaseComponent } from './../../../core/base/base.component';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

interface Bug{
  action: string,
  created_at: string,
  id: number,
  message: {
    id: number,
    message: string,
    receiver_id: null
    sender: {
      image: string, image_id: number, user_name: string, account_type: string, full_name: string, address: string
    }
    sender_id: number,
    subject: string,
  }
  updated_at:string,
  value: number
}

@Component({
  selector: 'app-new-bug',
  templateUrl: './new-bug.component.html',
  styleUrls: ['./new-bug.component.css']
})
export class NewBugComponent extends BaseComponent implements OnInit {

  @Input() Bug:Bug;

  @Output() onOpenForward = new EventEmitter<number>();

  ngOnInit() {
    if(this.Bug.message){
      if(this.Bug.message.sender.image_id){
        this.Bug.message.sender.image = this.main.imagesService.GetImagePreview(this.Bug.message.sender.image_id,{width:150,height:150});
      }
      else{
        this.Bug.message.sender.image = BaseImages.NoneFolowerImage;
      }
    }
  }

  openForward(){
    this.onOpenForward.emit(this.Bug.message.id);
  }



}

import { Component, OnInit, Input } from '@angular/core';
import { InboxMessageModel } from '../../../core/models/inboxMessage.model';

@Component({
  selector: 'app-message-feedback',
  templateUrl: './message-feedback.component.html',
  styleUrls: ['./message-feedback.component.css']
})
export class MessageFeedbackComponent implements OnInit {

  @Input() Message:InboxMessageModel = new InboxMessageModel();

  ngOnInit() {
  }

}

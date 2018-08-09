import { Component, OnInit, Input } from '@angular/core';
import { InboxMessageModel } from '../../../core/models/inboxMessage.model';

@Component({
  selector: 'app-message-accept',
  templateUrl: './message-accept.component.html',
  styleUrls: ['./message-accept.component.css']
})
export class MessageAcceptComponent implements OnInit {
  @Input() Message:InboxMessageModel = new InboxMessageModel();
  constructor() { }

  ngOnInit() {
  }

}

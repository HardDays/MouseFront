import { Component, OnInit, Input } from '@angular/core';
import { InboxMessageModel } from '../../../core/models/inboxMessage.model';

@Component({
  selector: 'app-message-blank',
  templateUrl: './message-blank.component.html',
  styleUrls: ['./message-blank.component.css']
})
export class MessageBlankComponent implements OnInit {

  @Input() Message:InboxMessageModel = new InboxMessageModel();

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(document).ready(function () {
    $('.support_answers .answer_head').click(function() {
      $(this).next().slideToggle();
      $(this).parent().toggleClass('opened');
    });

    $('.answer_file span').click(function() {
        $(this).parent().find('#answer_attach_file').click();
    });

    $('.mes_text_wrap span').click(function() {
        $(this).parent().find('#mes_attach_file').click();
    });
    });

  } 

}

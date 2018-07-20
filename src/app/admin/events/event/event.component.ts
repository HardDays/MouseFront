import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { Params } from '../../../../../node_modules/@angular/router';
import { EventGetModel } from '../../../core/models/eventGet.model';

declare var $:any;

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent extends BaseComponent implements OnInit {

  eventId = 0;
  Event:EventGetModel = new EventGetModel();

  ngOnInit() {
    this.InitJs();

    this.activatedRoute.params.subscribe(
      (params:Params) => {
        this.eventId = params['id'];
        this.main.adminService.GetEventById(this.eventId)
          .subscribe(
            (res)=>{
              this.Event = res;
              this.eventId = this.Event.id;
              console.log(`Event`,this.Event);
            }
          )
        
      }
    );
  }

  InitJs(){

    $('.photos-abs-wrapp').css({
      'max-height': $('.rel-wr-photoos').width()+'px'
    });

    $(window).resize(function(){
        $('.photos-abs-wrapp').css({
            'max-height': $('.rel-wr-photoos').width()+'px'
        });
    });

    $('.event_videos_slider').slick({
        dots: false,
        arrows: true,
        speed: 200

    });
  }

  removeEvent(){
    console.log(`removeAcc`);
    this.main.adminService.EventDelete(this.accId)
      .subscribe(
        (res)=>{
          console.log(`res`,res);
        },
        (err)=>{
          console.log(`err`,err)
        }
      )
  }

  denyEvent(){
    console.log(`denyAcc`);
    this.main.adminService.EventDeny(this.accId)
      .subscribe(
        (res)=>{
          console.log(`res`,res);
        },
        (err)=>{
          console.log(`err`,err)
        }
      )
  }

  approveEvent(){
    console.log(`approveAcc`);
    this.main.adminService.EventApprove(this.accId)
      .subscribe(
        (res)=>{
          console.log(`res`,res);
        },
        (err)=>{
          console.log(`err`,err)
        }
      )
  }

}

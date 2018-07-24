import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';

@Component({
  selector: 'app-analytics-event',
  templateUrl: './analytics-event.component.html',
  styleUrls: ['./analytics-event.component.css']
})
export class AnalyticsEventComponent extends BaseComponent implements OnInit {

  Counts = {
    all: 0,
    successful: 0,
    failed: 0
  }

  newStatusPer = 'month';
  newStatus = {
    all: 0,
    pending: 0,
    successful: 0,
    failed: 0

  }

  newEventPer = 'month';

  Individual:{name:string,date_from:string,is_crowdfunding_event:boolean, comments:number, likes:number, views:number, status:string}[] = [];
  paramsIndividual = {
    event_type_: {
      all:false,
      crowdfund:false,
      regular:false,
      viewed:false,
      liked:false,
      commented:false,
      successful:false,
      pending:false,
      failed:false,
    },
    sort_by: 'name',
    text: '',
    event_type:[]
  }

  ngOnInit() {
    this.GetInfo();
  }



  GetInfo(){
    this.main.adminService.GetEventsCounts()
      .subscribe(
        (res)=>{
          this.Counts = res;
        }
      )
    this.main.adminService.GetEventsNewStatus(this.newStatusPer)
      .subscribe(
        (res)=>{
          this.newStatus = res;
        }
    )
    
    this.getIndividuals();
    
  }

  setGraphNewStatusBy(per:string){
    this.newStatusPer = per;
  }

  setGraphNewEventsBy(per:string){
    this.newEventPer = per;
  }

  getIndividuals(){
    this.paramsIndividual.event_type = [];
    for(let t in this.paramsIndividual.event_type_){
      if(this.paramsIndividual.event_type_[t])
        this.paramsIndividual.event_type.push(t);
    }
    console.log(this.paramsIndividual);
    this.main.adminService.GetEventsIndividual(this.paramsIndividual)
    .subscribe(
      (res)=>{
        this.Individual = res;
      }
    )
  }



  public lineChartData:Array<any> = [
    {data: [{x:1,y:1},{x:2,y:2},{x:4,y:5}], label: 'FANS'},
    {data: [{x:1,y:1},{x:2,y:2},{x:3,y:4},{x:4,y:5}], label: 'VENUES'},
    {data: [{x:1,y:2},{x:2,y:3},{x:3,y:5},{x:4,y:0}], label: 'ARTISTS'}
  ];
  public lineChartLabels:Array<any> = [1,2,3,4,5];
  
  public lineChartOptions:any = {
    responsive: true,
    legend: {
      position:'bottom',
      labels: {
        fontColor: '#0f0f0f',
        fontFamily: 'AvenirLTStdBlack',
        fontSize: 15,
        padding: 50,
        usePointStyle: true,
        pointStyle: 'triangle'
        // color: ;
        // font: 14px ;
        // text-transform: uppercase;

      },
      elements:{
        point:{
          radius: 10,
        }
      }
    },
    tooltips: {
      titleFontSize: 16,
      bodyFontSize: 14,
      displayColors:false,
      titleMarginBottom: 9,
      titleSpacing: 6,
      bodySpacing: 6,
      xPadding: 15,
      yPadding: 15
    }
    
  };

  public lineChartColors:Array<any> = [
    { // pink
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(213,40,101,0.8)',
      pointBackgroundColor: 'rgba(213,40,101,0.8)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(95,92,208,0.8)',
      pointBackgroundColor: 'rgba(95,92,208,0.8)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // grey
      backgroundColor: 'rgba(0,0,0,0)',
      borderColor: 'rgba(54,196,194,0.8)',
      pointBackgroundColor: 'rgba(54,196,194,0.8)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
 
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

}

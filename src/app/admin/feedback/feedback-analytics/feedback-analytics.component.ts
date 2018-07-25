import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';

@Component({
  selector: 'app-feedback-analytics',
  templateUrl: './feedback-analytics.component.html',
  styleUrls: ['./feedback-analytics.component.css']
})
export class FeedbackAnalyticsComponent extends BaseComponent implements OnInit {

  //@ViewChild('baseChart') private _chart;
// _chart.ngOnChanges()

  Info = {
      bug: 0,
      enhancement: 0,
      compliment: 0
  }

  Rate = 0;

  graphBy:string  = 'month';

  graphInfo = {
    axis:[],
    bugs:[],
    enhancement:[],
    compliment:[]
  } 

  ngOnInit() {
    this.main.adminService.GetFeedbacksCounts()
      .subscribe(
        (res)=>{
          this.Info = res;
        }
      )
    this.main.adminService.GetFeedbacksOverall()
      .subscribe(
        (res)=>{
          this.Rate = res;
        }
      )

    this.UpdateGraph();
  }

  UpdateGraph(){

    this.main.adminService.GetFeedbacksGraph(this.graphBy)
      .subscribe(
        (res)=>{
          this.graphInfo = res;
          console.log(this.graphInfo);
         
          this.lineChartLabels.length = 0;
          this.lineChartLabels.push(...this.graphInfo.axis);
    
          let tmpDataBugs = [];
          let tmpDataCompliment = [];
          let tmpDataEnhancement = [];

          if(this.graphInfo.bugs){
            for(let d in this.graphInfo.bugs)
              tmpDataBugs.push({x:d,y:this.graphInfo.bugs[d]})
            // tmpDataBugs = [{x:10,y:10},{x:20,y:20},{x:40,y:50}];
          }
          if(this.graphInfo.compliment){
            for(let d in this.graphInfo.compliment)
              tmpDataCompliment.push({x:d,y:this.graphInfo.compliment[d]})
            // tmpDataCompliment = [{x:10,y:10},{x:20,y:20},{x:40,y:50}];
          }
          if(this.graphInfo.enhancement){
            for(let d in this.graphInfo.enhancement)
            tmpDataEnhancement.push({x:d,y:this.graphInfo.enhancement[d]})
            // tmpDataEnhancement = [{x:10,y:10},{x:20,y:20},{x:40,y:50}];
          }

      
          this.lineChartData.length = 0;

          this.lineChartData = [
            {data: tmpDataBugs, label: 'BUGS'},
            {data: tmpDataCompliment, label: 'COMPLIMENT'},
            {data: tmpDataEnhancement, label: 'ENHANCEMENT'}
          ];


        }
      )

    
    //this._chart.ngOnChanges();
  }

  setGraphBy(by:string){
    this.graphBy = by;
    this.UpdateGraph();
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
    },
    scales:{
      yAxes:[
        {
          ticks: { min: 0}
        }
      ],
      xAxes:[
        {
          ticks:{ min: 0}
        }
      ]
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

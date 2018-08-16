import { Component, OnInit, ViewChild, SimpleChange, ElementRef } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import * as chart from "ng2-charts";

@Component({
  selector: 'app-analytics-event',
  templateUrl: './analytics-event.component.html',
  styleUrls: ['./analytics-event.component.css']
})
export class AnalyticsEventComponent extends BaseComponent implements OnInit {

  @ViewChild('baseChart') _chart : chart.BaseChartDirective;
  @ViewChild('myCanvasPie') canvasPie: ElementRef; 

  

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

  newEventPer:string = 'month';
  

graphInfo = {
  axis:[],
  crowdfunding:[],
  regular:[]
} 

  Individual:{name:string,date_from:string,is_crowdfunding_event:boolean, comments:number, likes:number, views:number, status:string}[] = [];
  paramsIndividual = {
    event_type_: {
      funding: 'all',
      most: '',
      status: ''
    },
    sort_by: 'name',
    text: '',
    event_type:[]
  }

  //PIE
 
  public pieChartLabels:string[] = ['Successful', 'Pending', 'Failed'];
  public pieChartData:number[] = [0,0,0];
  public pieChartType:string = 'pie';

  public pieChartColors;
  public pieChartOptions;


  ngOnInit() {
    this.GetInfo();
    this.getIndividuals();
    this.UpdateGraph();

    this.pieChartColors = [
      { 
        backgroundColor: [this.GetGradient('blue'), this.GetGradient('yellow'), this.GetGradient('purple')],
        hoverBackgroundColor:[this.GetGradient('blue'), this.GetGradient('yellow'), this.GetGradient('purple')],
        hoverBorderColor: 'white',
      }  
    ];
    this.pieChartOptions = {
      tooltips: {
        titleFontSize: 16,
        bodyFontSize: 14,
        displayColors:false,
        },
        elements: {
          arc: {
              borderWidth: 8
          }
        }
      }

  }

  GetGradient(type:string){
    let gradient = this.canvasPie.nativeElement.getContext('2d').createRadialGradient(210, 100, 50, 210, 100, 200);
    if (type == 'blue'){
      gradient.addColorStop(0, '#079392');
      gradient.addColorStop(1, '#031b6f');
    }
    if (type == 'yellow'){
      gradient.addColorStop(0, '#ffd513');
      gradient.addColorStop(1, '#cb3305');
    }
    if (type == 'purple'){
      gradient.addColorStop(0, '#d1286f');
      gradient.addColorStop(1, '#6c0a75');
    }
    return gradient;
    
    
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
          // console.log("STATUS", this.newStatus);

          let succes = this.GetPercent(this.newStatus.successful);
          let pending = this.GetPercent(this.newStatus.pending);
          let failed = this.GetPercent(this.newStatus.failed);

          this.pieChartData.length = 0;

          this.pieChartData=[succes, pending, failed];

          
          
        }
    )
    
    
    
  
    
  }

  setGraphNewStatusBy(per:string){
    // console.log(per);
    this.newStatusPer = per;
    this.GetInfo();
  }

  GetPercent(data:number){
    // console.log(data);
    data = data/this.newStatus.all*100;
    return parseFloat(data.toFixed(1));
    
  }


  getIndividuals(){
    this.paramsIndividual.event_type = [];
    for(let t in this.paramsIndividual.event_type_)
    {
        this.paramsIndividual.event_type.push(this.paramsIndividual.event_type_[t]);
    }
    console.log("PARAMIND", this.paramsIndividual);
    this.main.adminService.GetEventsIndividual(this.paramsIndividual)
    .subscribe(
      (res)=>{
        this.Individual = res;
        
        
      }
    )
  }

  UpdateGraph(){

    this.main.adminService.GetEventsGraph(this.newEventPer)
      .subscribe(
        (res)=>{
          this.graphInfo = res;
          console.log("GRAPH", this.graphInfo);
         
          this.lineChartLabels.length = 0;
          this.lineChartLabels.push(...this.graphInfo.axis);
    
          let tmpDataCrowdfund = [];
          let tmpDataRegular = [];

          if(this.graphInfo.crowdfunding){
            for(let d in this.graphInfo.crowdfunding){
              const x = d;
              const y = this.graphInfo.crowdfunding[d];
              tmpDataCrowdfund.push({x,y});
            }
              
          }
          if(this.graphInfo.regular){
            for(let d in this.graphInfo.regular)
            {
              const x = d;
              const y = this.graphInfo.regular[d];
              tmpDataRegular.push({x,y});
            }
          }
          // this.SetMaxY();

          
      
          this.lineChartData.length = 0;

          this.lineChartData = [
            {data: tmpDataCrowdfund, label: 'CROWDFUNDING'},
            {data: tmpDataRegular, label: 'REGULAR'}
          ];


        }
      )

    
    //this._chart.ngOnChanges();
  }

  // SetMaxY(){
  //   // let y = this.lineChartOptions.scales.yAxes[0].ticks.max;
  //   console.log(this.lineChartData[0].data);
  //   let max = Math.max.apply(Math, this.lineChartData[0].data.map(function(obj){return obj.y;}));
    

  //   this.lineChartOptions.scales.yAxes[0].ticks.max = max + 1;
  //   console.log(this.lineChartOptions.scales.yAxes[0].ticks);
  // }

  // SetMinY(){
  //   let y = this.lineChartOptions.scales.yAxes[0].ticks.min;
  // }

  setGraphNewEventsBy(per:string){
    this.newEventPer = per;
    this.UpdateGraph();
  }

  public lineChartData:Array<any> = [
    {data: [{x:1,y:1},{x:2,y:2},{x:4,y:5}], label: 'FANS'},
    {data: [{x:1,y:1},{x:2,y:2},{x:3,y:4},{x:4,y:5}], label: 'VENUES'}
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
        // {
        //   ticks: { min: 0}
        // }
        {
          ticks:{ beginAtZero:true }
      }
      ],
      // xAxes:[
      //   {
      //     ticks:{ min: 0}
      //   }
      // ]
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
    // console.log(e);
  }
 
  public chartHovered(e:any):void {
    // console.log(e);
  }

 
  
}

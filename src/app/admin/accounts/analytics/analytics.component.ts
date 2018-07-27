import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent extends BaseComponent implements OnInit {

  Usage = { clicks:0, comments:0, likes:0};
  New = {fan:0, artist:0, venue:0}


graphBy:string  = 'month';

graphInfo = {
  axis:[],
  fan:[],
  artist:[],
  venue:[]
} 

  ngOnInit() {

    this.main.adminService.GetAccountsUserUsage()
      .subscribe(
        (res)=>{
          console.log(`Usage`,res);
          this.Usage = res;
        }
      )

      this.main.adminService.GetAccountsNew()
      .subscribe(
        (res)=>{
          console.log(`Usage`,res);
          this.New = res;
        }
      )
    this.UpdateGraph();
  }

  UpdateGraph(){

    this.main.adminService.GetAccountsGraph(this.graphBy)
      .subscribe(
        (res)=>{
          this.graphInfo = res;
          console.log(this.graphInfo);
         
          this.lineChartLabels.length = 0;
          this.lineChartLabels.push(...this.graphInfo.axis);
    
          let tmpDataFans = [];
          let tmpDataVenues = [];
          let tmpDataArtists = [];

          if(this.graphInfo.fan){
            for(let d in this.graphInfo.fan)
              tmpDataFans.push({x:d,y:this.graphInfo.fan[d]})
            // tmpDataBugs = [{x:10,y:10},{x:20,y:20},{x:40,y:50}];
          }
          if(this.graphInfo.venue){
            for(let d in this.graphInfo.venue)
              tmpDataVenues.push({x:d,y:this.graphInfo.venue[d]})
            // tmpDataCompliment = [{x:10,y:10},{x:20,y:20},{x:40,y:50}];
          }
          if(this.graphInfo.artist){
            for(let d in this.graphInfo.artist)
              tmpDataArtists.push({x:d,y:this.graphInfo.artist[d]})
            // tmpDataEnhancement = [{x:10,y:10},{x:20,y:20},{x:40,y:50}];
          }

      
          this.lineChartData.length = 0;

          this.lineChartData = [
            {data: tmpDataFans, label: 'FANS'},
            {data: tmpDataVenues, label: 'VENUES'},
            {data: tmpDataArtists, label: 'ARTISTS'}
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
          // ticks: { min: 0}
          ticks:{
            beginAtZero:true
          }
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
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }











}

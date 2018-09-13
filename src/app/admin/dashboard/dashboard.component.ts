import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { EventGetModel } from '../../core/models/eventGet.model';
import { CheckModel } from '../../core/models/check.model';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  Counts = {fan:0, artist:0, venue:0};
  Accounts: CheckModel<AccountGetModel>[] = [];
  Events:CheckModel<any>[] = [];
  ScrollArtistDisabled = true;
  ScrollEventsDisabled = true;

  graphInfo = {
    axis:[],
    fan:[],
    artist:[],
    venue:[]
  } 

  ngOnInit() {
    this.GetInfo();
    this.UpdateGraph();
  }

  UpdateGraph(){

    this.main.adminService.GetAccountsGraph('month')
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

  GetInfo(){
    if(this.MyUser.is_admin||this.MyUser.is_superuser){
      this.main.adminService.GetAccountsNew()
        .subscribe(
          (res)=>{
            this.Counts = res;
          }
        )

      this.main.adminService.GetAccountsRequests({account_type: 'all',limit:20,offset:0})
        .subscribe(
          (res)=>{
            this.Accounts = this.convertArrToCheckModel<any>(res);
            setTimeout(() => {
              this.ScrollArtistDisabled = false;
            }, 200);
          }
        )

      this.main.adminService.GetEventsRequests({limit:20,offset:0})
        .subscribe(
          (res)=>{
            this.Events = this.convertArrToCheckModel<any>(res);
            //  console.log(res);
            setTimeout(() => {
              this.ScrollEventsDisabled = false;
            }, 200);
          }
        )
    }
  }

  onScrollArtist(){
    this.ScrollArtistDisabled = true;
    this.main.adminService.GetAccountsRequests({account_type: 'all',limit:20,offset:this.Accounts.length})
      .subscribe(
        (res)=>{
          this.Accounts.push(...this.convertArrToCheckModel<any>(res));
          setTimeout(() => {
            this.ScrollArtistDisabled = false;
          }, 200);
        }
      )
  }

  onScrollEvent(){
    this.ScrollEventsDisabled = true;
    this.main.adminService.GetEventsRequests({limit:20,offset:this.Events.length})
      .subscribe(
        (res)=>{
          this.Events.push(...this.convertArrToCheckModel<any>(res));
          //  console.log(res);
          setTimeout(() => {
            this.ScrollEventsDisabled = false;
          }, 200);
        }
      )
  }

  openTabsAcc(){
    for(let acc of this.Accounts){
      if(acc.checked){
        // window.open( window.location.origin + '/admin/account/'+acc.object.id,'_blank');
        window.open('http://mouse-web.herokuapp.com/admin/account/'+acc.object.id,'_blank');
        window.blur();
      }
    }
  }

  openTabsEvent(){
    for(let event of this.Events){
      if(event.checked){
        // window.open(window.location.origin + '/admin/event/'+event.object.id,'_blank');
        window.open('http://mouse-web.herokuapp.com/admin/event/'+event.object.id,'_blank');
        window.blur();
      }
    }
  }

  deleteAccs(){
    for(let acc of this.Accounts){
      if(acc.checked){
        this.main.adminService.AccountDelete(acc.object.id)
          .subscribe(
            (res)=>{
              // console.log(acc.object.id,`ok`);
              this.Accounts.splice(this.Accounts.indexOf(acc),1)
            },
            (err)=>{
              console.log(`err`,err)
            }
          )
      }
    }
  }

  deleteEvents(){
    for(let events of this.Events){
      if(events.checked){
        this.main.adminService.EventDelete(events.object.id)
          .subscribe(
            (res)=>{
              // console.log(events.object.id,`ok`);
              this.Events.splice(this.Events.indexOf(events),1)
            },
            (err)=>{
              console.log(`err`,err)
            }
          )
      }
    }
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


}

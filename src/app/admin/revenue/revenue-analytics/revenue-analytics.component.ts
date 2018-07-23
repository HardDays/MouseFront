import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';

@Component({
  selector: 'app-revenue-analytics',
  templateUrl: './revenue-analytics.component.html',
  styleUrls: ['./revenue-analytics.component.css']
})
export class RevenueAnalyticsComponent extends BaseComponent implements OnInit {

  citiesTotal= {total:0 , cities:[{price:0,address:''}]};
  citiesSales = {total:0 , cities:[{price:0,address:''}]};


  countsAdvertisingTotal = 0;
  countsAdvertisingSales = 0;


  countsArtistTotal = 0;
  countsArtistSales = 0;

  countsDateTotal = 0;
  countsDateSales = 0;

  countsFundingTotal = 0;
  countsFundingSales = 0;

  countsTicketsTotal = 0;
  countsTicketsSales = 0;

  countsVenueTotal = 0;
  countsVenueSales = 0;

  countsVrTotal = 0;
  countsVrSales = 0;




  ngOnInit() {
    console.log();
    this.main.adminService.GetRevenueCities('total')
      .subscribe(
        (res)=>{
          this.citiesTotal = res;
        }
      )

    this.main.adminService.GetRevenueCities('sales')
      .subscribe(
        (res)=>{
          this.citiesSales = res;
        }
      )



      this.main.adminService.GetRevenueCountsAdvertising('total','all')
      .subscribe(
        (res)=>{
          this.countsAdvertisingTotal = res;
        }
      )
      this.main.adminService.GetRevenueCountsAdvertising('sales','all')
      .subscribe(
        (res)=>{
          this.countsAdvertisingSales = res;
        }
      )



      this.main.adminService.GetRevenueCountsArtist('total','all')
      .subscribe(
        (res)=>{
          this.countsArtistTotal = res;
        }
      )
      this.main.adminService.GetRevenueCountsArtist('sales','all')
      .subscribe(
        (res)=>{
          this.countsArtistSales = res;
        }
      )



      this.main.adminService.GetRevenueCountsDate('total','all')
      .subscribe(
        (res)=>{
          this.countsDateTotal = res;
        }
      )
      this.main.adminService.GetRevenueCountsDate('sales','all')
      .subscribe(
        (res)=>{
          this.countsDateSales = res;
        }
      )



      this.main.adminService.GetRevenueCountsFunding('total','all','regular')
      .subscribe(
        (res)=>{
          this.countsFundingTotal = res;
        }
      )
      this.main.adminService.GetRevenueCountsFunding('sales','all','regular')
      .subscribe(
        (res)=>{
          this.countsFundingSales = res;
        }
      )



      this.main.adminService.GetRevenueCountsTickets('total','all')
      .subscribe(
        (res)=>{
          this.countsTicketsTotal = res;
        }
      )
      this.main.adminService.GetRevenueCountsTickets('sales','all')
      .subscribe(
        (res)=>{
          this.countsTicketsSales = res;
        }
      )



      this.main.adminService.GetRevenueCountsVenue('total','all')
      .subscribe(
        (res)=>{
          this.countsVenueTotal = res;
        }
      )
      this.main.adminService.GetRevenueCountsVenue('sales','all')
      .subscribe(
        (res)=>{
          this.countsVenueSales = res;
        }
      )




      this.main.adminService.GetRevenueCountsVr('total','all')
      .subscribe(
        (res)=>{
          this.countsVrTotal = res;
        }
      )
      this.main.adminService.GetRevenueCountsVr('sales','all')
      .subscribe(
        (res)=>{
          this.countsVrSales = res;
        }
      )








  }



indexColor = 0;
nextColor(){
  let colors = ['#991f72','#d2365d','#5157b8','#f2ad0f','#942541','#079391'];
  let color = colors[this.indexColor%colors.length];
  this.indexColor = this.indexColor+1;
  return {'background-color':color};
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

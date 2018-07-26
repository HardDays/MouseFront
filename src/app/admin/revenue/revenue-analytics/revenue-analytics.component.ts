import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';

@Component({
  selector: 'app-revenue-analytics',
  templateUrl: './revenue-analytics.component.html',
  styleUrls: ['./revenue-analytics.component.css']
})
export class RevenueAnalyticsComponent extends BaseComponent implements OnInit {
  

  citiesTotal= {total:0 , cities:[{price:0,address:'',color:'#000000'}]};
  citiesSales = {total:0 , cities:[{price:0,address:'',color:'#000000'}]};
  totalCitiesGraphBy = 'all';
  salesCitiesGraphBy = 'all';

  countsAdvertisingTotal = 0;
  countsAdvertisingSales = 0;

  countsArtistTotal = 0;
  countsArtistSales = 0;


  countsDateTotal = 0;
  countsDateSales = 0;

  countsFundingTotal = 0;
  countsFundingSales = 0;

  countsFundingTotalType = 'regular';
  countsFundingSalesType = 'regular';
  countsFundingTotalBy = 'all';
  countsFundingSalesBy = 'all';

  countsTicketsTotal = 0;
  countsTicketsSales = 0;


  countsVenueTotal = 0;
  countsVenueSales = 0;

  countsVrTotal = 0;
  countsVrSales = 0;


  pieChartLabelsTotal:string[] = [''];
  pieChartDataTotal:number[] = [];
  pieChartLabelsSales:string[] = [''];
  pieChartDataSales:number[] = [];
  pieChartType:string = 'pie';
  pieChartColors:Array<any> = [
    { 
      backgroundColor: 'rgba(213,40,101,0.8)',
    },
    { 
      backgroundColor: 'rgba(95,92,208,0.8)',
    },
    { 
      backgroundColor: 'rgba(54,196,194,0.8)',
    }
  ];



  ngOnInit() {

    this.GetRevenueCountsCitiesTotal();
    this.GetRevenueCountsCitiesSales();
    
    this.GetRevenueCountsAdvertisingTotal('all');
    this.GetRevenueCountsAdvertisingSales('all');

    this.GetRevenueCountsArtistTotal('all');
    this.GetRevenueCountsArtistSales('all');

    this.GetRevenueCountsDateTotal('all');
    this.GetRevenueCountsDateSales('all');
    
    this.GetRevenueCountsTicketsTotal('all');
    this.GetRevenueCountsTicketsSales('all');

    this.GetRevenueCountsVenueTotal('all');
    this.GetRevenueCountsVenueSales('all');

    this.GetRevenueCountsVrTotal('all');
    this.GetRevenueCountsVrSales('all');

    this.GetFundingCountsTotal('all');
    this.GetFundingCountsSales('all');
    // crowdfunding
   

  }


  GetRevenueCountsCitiesTotal(){
    this.main.adminService.GetRevenueCities('total')
      .subscribe(
        (res)=>{
          this.citiesTotal = res;
          this.setCitiesColors('total');
          this.setGraphCitiesTotal();
        }
      )
  }

  GetRevenueCountsCitiesSales(){
    this.main.adminService.GetRevenueCities('sales')
      .subscribe(
        (res)=>{
          this.citiesSales = res;
          this.setCitiesColors('sales');
          this.setGraphCitiesSales();
        }
      )
  }

  GetRevenueCountsDateTotal(period:string){
    this.main.adminService.GetRevenueCountsDate('total',period)
    .subscribe(
      (res)=>{
        this.countsDateTotal = res
      }
    )
  }
  GetRevenueCountsDateSales(period:string){
    this.main.adminService.GetRevenueCountsDate('sales',period)
    .subscribe(
      (res)=>{
        this.countsDateSales = res
      }
    )
  }
  GetRevenueCountsAdvertisingTotal(period:string){
    this.main.adminService.GetRevenueCountsAdvertising('total',period)
    .subscribe(
      (res)=>{
        res=>this.countsAdvertisingTotal = res;
      }
    )
  }
  GetRevenueCountsAdvertisingSales(period:string){
    this.main.adminService.GetRevenueCountsAdvertising('sales',period)
    .subscribe(
      (res)=>{
        res=>this.countsAdvertisingSales = res;
      }
    )
  }
  GetRevenueCountsArtistTotal(period:string){
    this.main.adminService.GetRevenueCountsArtist('total',period)
      .subscribe(
        (res)=>{
          this.countsArtistTotal = res
        }
      )
  }
  GetRevenueCountsArtistSales(period:string){
    this.main.adminService.GetRevenueCountsArtist('sales',period)
      .subscribe(
        (res)=>{
          this.countsArtistSales = res
        }
      )
  }
  GetRevenueCountsTicketsTotal(period:string){
    this.main.adminService.GetRevenueCountsTickets('total',period)
      .subscribe(
        (res)=>{
          this.countsTicketsTotal = res
        }
      )
  }
  GetRevenueCountsTicketsSales(period:string){
    this.main.adminService.GetRevenueCountsTickets('sales',period)
      .subscribe(
        (res)=>{
          this.countsTicketsSales = res
        }
      )
  }
  GetRevenueCountsVenueTotal(period:string){
    this.main.adminService.GetRevenueCountsVenue('total',period)
      .subscribe(
        (res)=>{
          this.countsVenueTotal = res
        }
      )
  }
  GetRevenueCountsVenueSales(period:string){
    this.main.adminService.GetRevenueCountsVenue('sales',period)
      .subscribe(
        (res)=>{
          this.countsVenueSales = res
        }
      )
  }
  GetRevenueCountsVrTotal(period:string){
    this.main.adminService.GetRevenueCountsVr('total',period)
      .subscribe(
        (res)=>{
          this.countsVenueTotal = res
        }
      )
  }
  GetRevenueCountsVrSales(period:string){
    this.main.adminService.GetRevenueCountsVr('sales',period)
      .subscribe(
        (res)=>{
          this.countsVenueSales = res
        }
      )
  }

  GetFundingCountsTotal(period:string){
    this.main.adminService.GetRevenueCountsFunding('total',this.countsFundingTotalBy,this.countsFundingTotalType)
      .subscribe(
        (res)=>{
          this.countsFundingTotal = res;
        }
      )
  }
  GetFundingCountsSales(period:string){
    this.main.adminService.GetRevenueCountsFunding('sales',this.countsFundingSalesBy,this.countsFundingSalesType)
      .subscribe(
        (res)=>{
          this.countsFundingSales = res;
        }
      )
  }



  setCitiesColors(type:string){
    let index = 0;
    let colors = ['#991f72','#d2365d','#5157b8','#f2ad0f','#942541','#079391'];
    for(let el of type==='total'?this.citiesTotal.cities:this.citiesSales.cities){
      el.color =  colors[index%colors.length];
      index = index+1;
    }
  }

  setGraphCitiesTotal(){
    this.pieChartLabelsTotal.length = 0;
    for (let d of this.citiesTotal.cities) {
      this.pieChartLabelsTotal.push(d.address);
    }

    this.pieChartDataTotal = [];
    this.pieChartDataTotal.length = 0;
    for (let d of this.citiesTotal.cities) {
      this.pieChartDataTotal.push(this.GetPercentTotal(d.price));
    }
  }

  setGraphCitiesSales(){
    this.pieChartLabelsSales.length = 0;
    for (let d of this.citiesSales.cities) {
      this.pieChartLabelsSales.push(d.address);
    }

    this.pieChartDataSales = [];
    this.pieChartDataSales.length = 0;
    for (let d of this.citiesSales.cities) {
      this.pieChartDataSales.push(this.GetPercentSales(d.price));
    }
  }

  GetPercentTotal(data:number){
    console.log("DATA", data);
    console.log("city", this.citiesTotal.total);
    
    data = data/this.citiesTotal.total*100;
    return parseFloat(data.toFixed(1));
    
  }

  GetPercentSales(data:number){
    console.log("DATA", data);
    console.log("city", this.citiesSales.total);
    
    data = data/this.citiesSales.total*100;
    return parseFloat(data.toFixed(1));
    
  }



}
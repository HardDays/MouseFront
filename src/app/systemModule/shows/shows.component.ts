import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { AuthMainService } from '../../core/services/auth.service';
import { AuthService } from "angular2-social-login";
import { BaseComponent } from '../../core/base/base.component';
import { AccountGetModel } from '../../core/models/accountGet.model';
import { AccountSearchParams } from '../../core/models/accountSearchParams.model';
import { SelectModel } from '../../core/models/select.model';
import { Base64ImageModel } from '../../core/models/base64image.model';
import { AccountType } from '../../core/base/base.enum';

declare var $:any;

@Component({
  selector: 'shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.css']
})


export class ShowsComponent extends BaseComponent implements OnInit {
  MIN_PRICE:number = 0;
  MAX_PRICE:number = 100000;
  MIN_CAPACITY:number = 0;
  MAX_CAPACITY:number = 70000;
  Roles = AccountType;
  SearchParams: AccountSearchParams = new AccountSearchParams();
  AccountTypes:SelectModel[] = [];
  Accounts:AccountGetModel[] = [];
  Images:string[] = [];

  ngOnInit(){

    $(".nav-button").on("click", function (e) {
      e.preventDefault();
      $("body").addClass("has-active-menu");
      $(".mainWrapper").addClass("has-push-left");
      $(".nav-holder-3").addClass("is-active");
      $(".mask-nav-3").addClass("is-active")
    });
    $(".menu-close, .mask-nav-3").on("click", function (e) {
        e.preventDefault();
        $("body").removeClass("has-active-menu");
        $(".mainWrapper").removeClass("has-push-left");
        $(".nav-holder-3").removeClass("is-active");
        $(".mask-nav-3").removeClass("is-active")
    });
    let _this = this;
    var price_slider = $(".price-slider").ionRangeSlider({
      type:"double",
      min: this.MIN_PRICE,
      max: this.MAX_PRICE,
      from: 0,
      hide_min_max: false,
      prefix: "$ ",
      grid: false,
      prettify_enabled: true,
      prettify_separator: ',',
      grid_num: 5,
      onChange: function(data)
      {
        _this.PriceChanged(data);
      }
  });
  var capacity_slider = $(".capacity-slider").ionRangeSlider({
    type:"double",
    min: this.MIN_CAPACITY,
    max: this.MAX_CAPACITY,
    from: 0,
    hide_min_max: false,
    prefix: "",
    grid: false,
    prettify_enabled: true,
    prettify_separator: ',',
    grid_num: 5,
    onChange: function(data)
    {
      _this.CapacityChanged(data);
    }
});

    this.AccountTypes = this.typeService.GetAllAccountTypes();
    this.GetAccounts();

  }

  GetAccounts()
  {
    this.accService.AccountsSearch(this.SearchParams)
    .subscribe((res:AccountGetModel[])=>{
      this.Accounts = res;
      console.log(this.Accounts);
    })
  }

  GetImages()
  {
    this.Images = [];
    for(let item of this.Accounts)
    {
      this.Images[item.id] = "";
      if(item.image_id)
      {
        this.imgService.GetImageById(item.image_id)
          .subscribe((res:Base64ImageModel)=>{
            this.Images[item.id] = res.base64;
          })
      }
    }

  }

  PriceChanged(data:any)
  {
    if(data.from && this.SearchParams.price_from != data.from)
      this.SearchParams.price_from = data.from;
    if(data.to && this.SearchParams.price_to != data.to)  
      this.SearchParams.price_to = data.to;

    console.log(this.SearchParams);
  }

  CapacityChanged(data:any)
  {
    if(data.from && this.SearchParams.capacity_from != data.from)
      this.SearchParams.capacity_from = data.from;
    if(data.from && this.SearchParams.capacity_to != data.from)
      this.SearchParams.capacity_to = data.to;

    console.log(this.SearchParams);
  }
  
}

import { Component, OnInit, NgZone, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { MainService } from '../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { UserGetModel } from '../../core/models/userGet.model';
import { UserCreateModel } from '../../core/models/userCreate.model';
import { ErrorComponent } from '../../shared/error/error.component';
import { TranslateService } from '../../../../node_modules/@ngx-translate/core';
import { SettingsService } from '../../core/services/settings.service';


declare var $:any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent extends BaseComponent implements OnInit {

  Parts = PageParts;
  CurrentPart = PageParts.PersonalInfo;

  CustomerParts = CustomerPageParts;
  customerPage = CustomerPageParts.sendQuestion;
  IsShowCustomerSupport = false;

    User:UserGetModel = new UserGetModel();

  constructor(
    protected main           : MainService,
    protected _sanitizer     : DomSanitizer,
    protected router         : Router,
    protected mapsAPILoader  : MapsAPILoader,
    protected ngZone         : NgZone,
    protected activatedRoute : ActivatedRoute,
    protected cdRef          : ChangeDetectorRef,
    protected translate      :TranslateService,
    protected settings       :SettingsService

  ) {
    super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute,translate,settings);

  }

  @ViewChild('errorCmp') errorCmp: ErrorComponent;

  ngOnInit() {

    this.initJS();
    this.GetUser();
    
  }

  GetUser(){
    this.main.authService.GetMe()
        .subscribe(
            (res:UserGetModel)=>{
                this.User = res;
            },
            (err)=>{
            }
        )
  }
  SaveUser(user:UserCreateModel){
      this.main.authService.UpdateUser(user)
        .subscribe(
            (res:any)=>{
                this.User = res;
            },
            (err)=>{
            }
        );
  }


    initJS(){

        // $('.opening').click(function(e) {
        //   e.preventDefault();
        //   if (!$(this).parents('li').hasClass('opened')) {
        //       $(this).parents('li').addClass('opened');
        //       $(this).parents('li').find('.submenu').slideDown();
        //   }
        //   else {
        //       $(this).parents('li').find('.submenu').slideUp();
        //       $(this).parents('li').removeClass('opened');
        //   }
        // });

            $('.card_number input').keyup(function(e) {
        if ($(this).val().length === 4) {
            $(this).next().focus();
        }
        else if ($(this).val().length === 0 && e.which === 8) {
            $(this).prev().focus();
        }
            });

            $('.feedback_form .stars span').mouseover(function(e) {
        let num = $(this).index();
        $('.feedback_form .stars span').each(function(e) {
            if ($(this).index() <= num) {
                $(this).addClass('active');
            }
            else {
                $(this).removeClass('active');
            }
        });
        });
        $('.feedback_form .stars span').mouseout(function(e) {
            if (!$('.feedback_form .stars').hasClass('choosed'))
                $('.feedback_form .stars span').removeClass('active');
        });
        $('.feedback_form .stars span').click(function(e) {
            let num = $(this).index();
            if (!$('.feedback_form .stars').hasClass('choosed')) {
                $('.feedback_form .stars').addClass('choosed');
            }
            $('#rate_star').val(parseInt(num)+1);
        });
    }

    CustomerSupportClick(){
        if( this.CurrentPart == this.Parts.CustomerSupport)
            this.IsShowCustomerSupport =! this.IsShowCustomerSupport;
        else
            this.IsShowCustomerSupport = true;
        this.CurrentPart = this.Parts.CustomerSupport;
    }

    Success($event)
    {
        this.errorCmp.OpenWindow($event);
    }
   


}

export enum PageParts
{
  PersonalInfo = 0,
  Preferences = 1,
  FinancialInfo = 2,
  Feedback = 3,
  CustomerSupport = 4,
  TermsOfService = 5,
  PrivacyPolicy = 6
};

export enum CustomerPageParts
{
  sendQuestion = 0
};
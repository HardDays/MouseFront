import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { BaseComponent } from '../../core/base/base.component';
import { MainService } from '../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { UserGetModel } from '../../core/models/userGet.model';
import { UserCreateModel } from '../../core/models/userCreate.model';

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

    User:UserGetModel = new UserGetModel();

  constructor(
    protected main           : MainService,
    protected _sanitizer     : DomSanitizer,
    protected router         : Router,
    protected mapsAPILoader  : MapsAPILoader,
    protected ngZone         : NgZone,
    protected activatedRoute : ActivatedRoute,
    protected cdRef          : ChangeDetectorRef
  ) {
    super(main,_sanitizer,router,mapsAPILoader,ngZone,activatedRoute);
  }
  

  ngOnInit() {
    this.initJS();
    this.GetUser();
  }

  GetUser(){
    this.main.authService.GetMe()
        .subscribe(
            (res:UserGetModel)=>{
                this.User = res;
                console.log(`res`,this.User);
            },
            (err)=>{
                console.log(`err`,err);
            }
        )
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
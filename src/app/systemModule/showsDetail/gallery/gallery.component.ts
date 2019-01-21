import { Component, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, ViewChild } from '@angular/core';
import { BaseComponent } from "../../../core/base/base.component";
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Base64ImageModel } from '../../../core/models/base64image.model';

declare var $:any;

@Component({
  selector: 'show-gallery-cmp',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class ShowDetailGalleryComponent extends BaseComponent implements OnChanges{
    
    @Input() Venue: AccountGetModel;
    @Input() Artists: AccountGetModel[];
    Images:string[] = [];
    isShow = false;
    @ViewChild('slideshow') slideshow: any;

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.Venue)
        {
            this.Venue = changes.Venue.currentValue;
           
        }
        if(changes.Artists)
        {
            this.Artists = changes.Artists.currentValue;
            
        }
        this.GetImages();
    }

    GetImages()
    {
        // this.isShow = false;
        this.Images = [];
        if(this.Venue && this.Venue.id)
        {
           
            this.GetImageByAccount(this.Venue.id);
        }
        if(this.Artists && this.Artists.length)
        {
            // this.Images = [];
            for(let item of this.Artists)
            {
                this.GetImageByAccount(item.id);
            }
        }
    }

    changeSlide(int){
        this.slideshow.onSlide(int);
    }
   

    GetImageByAccount(accId)
    {
        this.WaitBeforeLoading(
            () => this.main.imagesService.GetAccountImages(accId),
            (res) => {
                if ( res.total_count > 0 ) 
                {
                    for ( const item of res.images ) 
                    {
                        const url = this.main.imagesService.GetImagePreview(item.id,{width:750,height:530});
                        if(this.Images.indexOf(url) < 0)
                        {
                            this.Images.push(url);
                        };
                    }
                }
            }
        );
    }

    InitSlider()
    {
        if(!$('.iframe-slider-wrapp').not('.slick-initialized').length){
            $('.iframe-slider-wrapp').slick('unslick');
        }

        // if($('.iframe-slider-wrapp').not('.slick-initialized').length){
        //     $('.iframe-slider-wrapp').slick({
        //         dots: false,
        //         arrows: true,
        //         infinite: false,
        //         slidesToShow: 1
        //     });

        // }
        setTimeout(()=>{
            this.InitSliderWrapp();
        },3000);
    }

    InitSliderWrapp() 
    {        
        this.isShow = true;
        if($('.iframe-slider-wrapp').not('.slick-initialized').length){
            $('.iframe-slider-wrapp').slick({
                dots: false,
                arrows: true,
                infinite: false,
                slidesToShow: 1
            });

        }

    }

}
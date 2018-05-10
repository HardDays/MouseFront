import { Component, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from "../../../core/base/base.component";
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Base64ImageModel } from '../../../core/models/base64image.model';

declare var $:any;

@Component({
  selector: 'show-gallery-cmp',
  templateUrl: './gallery.component.html',
  styleUrls: ['./../showsDetail.component.css']
})
export class ShowDetailGalleryComponent extends BaseComponent implements OnChanges{
    
    @Input() Venue: AccountGetModel;
    @Input() Artists: AccountGetModel[];
    Images:string[] = [];


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
        this.Images = [];
        if(this.Venue && this.Venue.id)
        {
            this.GetImageByAccount(this.Venue.id);
        }
        if(this.Artists && this.Artists.length)
        {
            for(let item of this.Artists)
            {
                this.GetImageByAccount(item.id);
            }
        }
    }

    GetImageByAccount(accId)
    {
        this.WaitBeforeLoading(
            () => this.main.imagesService.GetAccountImages(accId),
            (res) => {
                if(res.total_count > 0 )
                {
                    for(let i in res.images)
                    {
                        this.WaitBeforeLoading(
                            () => this.main.imagesService.GetImageById(res.images[i].id),
                            (res:Base64ImageModel) => {
                                if(res && res.base64)
                                {
                                    if(this.Images.indexOf(res.base64) < 0)
                                    {
                                        this.Images[res.id] = res.base64;
                                        this.Images = this.Images.filter(obj => obj && obj.length > 0).map(obj => obj);
                                        this.InitSlider();
                                    }
                                }
                            }
                        );
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
        //     console.log('проинитили слайдер');
        //     $('.iframe-slider-wrapp').slick({
        //         dots: false,
        //         arrows: true,
        //         infinite: false,
        //         slidesToShow: 1
        //     });

        // }
        setTimeout(()=>{
            this.InitSliderWrapp();
        },500);
    }

    InitSliderWrapp() 
    {        
        if($('.iframe-slider-wrapp').not('.slick-initialized').length){
            $('.iframe-slider-wrapp').slick({
                dots: false,
                arrows: true,
                infinite: false,
                slidesToShow: 1
            });

        }
        //если да
    }

}
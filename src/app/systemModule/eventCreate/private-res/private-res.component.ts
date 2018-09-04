import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../core/base/base.component';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AccountCreateModel } from '../../../core/models/accountCreate.model';
import { AccountGetModel } from '../../../core/models/accountGet.model';
import { AccountAddToEventModel } from '../../../core/models/artistAddToEvent.model';


@Component({
  selector: 'app-private-res',
  templateUrl: './private-res.component.html',
  styleUrls: ['./private-res.component.css']
})
export class PrivateResComponent extends BaseComponent implements OnInit {

  @Input() EventId:number;
  @Output() OnCreate = new EventEmitter();
  @Output() OnError = new EventEmitter<string>();

  addVenue:AccountAddToEventModel = new AccountAddToEventModel();

  privateVenueForm : FormGroup ;
  privateVenueCreate:AccountCreateModel = new AccountCreateModel();
  privateVenue:AccountGetModel = new AccountGetModel();
  imagesListPrivateRes:string[] = [];

  phoneMask:string='';

  ngOnInit() {

    this.CreateLocalAutocomplete();

    this.privateVenueCreate.phone = this.main.MyUser.register_phone;
    this.phoneMask = this.privateVenueCreate.phone;

    this.privateVenueForm = new FormGroup({
            "user_name": new FormControl("", [Validators.required]),
            "phone": new FormControl(""),
            "capacity": new FormControl(),
            "country": new FormControl(""),
            "city": new FormControl(""),
            "address":new FormControl("",[Validators.required]),
            "description": new FormControl(""),
            "venue_video_links": new FormArray([
                new FormControl("http://")
            ]),
            "link_two": new FormControl(""),
            "has_vr": new FormControl(""),
            "web_site": new FormControl("")
        });
  }

    CreateLocalAutocomplete()
    {
        this.CreateAutocomplete(
            (addr,place) => {

                if(place)
                {
                    this.privateVenueCreate.address = place.formatted_address;
                    //this.Venue.lat = place.geometry.location.toJSON().lat;
                    //this.Venue.lng = place.geometry.location.toJSON().lng;
                }
                setTimeout(() => {


                for(let a of addr)
                {

                    if(a.search('locality') > 0)
                    {
                        this.privateVenueCreate.city = a.slice(a.search('>')+1,a.search('</'));
                    }
                    else if(a.search('street-address') > 0)
                    {
                        this.privateVenueCreate.address = a.slice(a.search('>')+1,a.search('</'));
                    }
                    else if(a.search('region') > 0)
                    {
                        this.privateVenueCreate.state = a.slice(a.search('>')+1,a.search('</'));
                    }
                    else if(a.search('country-name') > 0)
                    {
                        this.privateVenueCreate.country = a.slice(a.search('>')+1,a.search('</'));
                    }
                    else if(a.search('postal-code') > 0)
                    {
                        this.privateVenueCreate.zipcode = a.slice(a.search('>')+1,a.search('</'));
                    }
                }
                }, 400);
            }
        );
    }
      //
    addPriateVenue(){
        if(!this.privateVenueForm.invalid){

            this.addVenue.event_id = this.EventId;

            for (let key in this.privateVenueForm.value) {
                if (this.privateVenueForm.value.hasOwnProperty(key)) {
                        this.privateVenueCreate[key] = this.privateVenueForm.value[key];
                }
            }

            if(this.privateVenueCreate.has_vr != true)
                this.privateVenueCreate.has_vr = false;

            this.privateVenueCreate.account_type = 'venue';
            this.privateVenueCreate.venue_type = 'private_residence';


            if(this.imagesListPrivateRes&&this.imagesListPrivateRes[0])
                this.privateVenueCreate.image_base64 = this.imagesListPrivateRes[0];


                this.main.accService.CreateAccount(this.privateVenueCreate)
                    .subscribe(
                        (acc:AccountGetModel)=>{
                            this.privateVenue = acc;

                            this.addVenue.venue_id = acc.id;
                            this.addVenue.account_id = this.main.CurrentAccount.id;



                            this.privateVenueForm.reset();

                            this.main.eventService.AddVenue(this.addVenue).
                                subscribe((res)=>{
                                    // console.log(`create`);
                                    this.OnCreate.emit();

                            });


                            let listImages = this.imagesListPrivateRes;
                            this.imagesListPrivateRes = [];

                            for(let img of listImages){
                                this.main.accService.PostAccountImages(acc.id,img)
                                .subscribe((res)=>{
                            });
                         }

                    },
                    (err)=>{
                        // console.log(`err`,err);
                    }
                );
        }
        else {
          this.OnError.emit(this.getFormErrorMessage(this.privateVenueForm,'venue'));
            //console.log(`Invalid About Form!`, this.privateVenueForm);
        }
    }

    addPhone(){
        (<FormArray>this.privateVenueForm.controls["venue_video_links"]).push(new FormControl("http://", Validators.required));
    }

    loadPhoto($event:any):void{
        this.ReadImages(
            $event.target.files,
            (res:string)=>{
                this.imagesListPrivateRes.push(res);

            }
        );
    }


}

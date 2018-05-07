import { Component, OnInit, Input, NgZone, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { AccountCreateModel, Rider } from '../../../core/models/accountCreate.model';
import { BaseComponent } from '../../../core/base/base.component';
import { MainService } from '../../../core/services/main.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-artist-riders',
  templateUrl: './artist-riders.component.html',
  styleUrls: ['./artist-riders.component.css']
})
export class ArtistRidersComponent extends BaseComponent implements OnInit {

  @Input() Artist:AccountCreateModel;

  @Output() OnSave = new EventEmitter<AccountCreateModel>();
  @Output() OnError = new EventEmitter<string>();

  riders:Rider[] = [];
  stageRider:Rider= new Rider();
  backstageRider:Rider= new Rider();
  hospitalityRider:Rider= new Rider();
  technicalRider:Rider= new Rider();
  
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
  }
  Init(artist:AccountCreateModel){
    this.Artist = artist;
    this.getRiders();
  }

  loadRiderFile($event:any){
    let target = $event.target;
    let file:File = target.files[0];
  
    for(let file of target.files)
    {
      let reader:FileReader = new FileReader();
      reader.onload = (e) =>{
        this.stageRider.uploaded_file_base64 = reader.result;
      }
      reader.readAsDataURL(file);
    }
 
  }

    getRiders(){
    if(this.Artist&&this.Artist.artist_riders){
      this.riders = [];
      for(let r of this.Artist.artist_riders){
        this.riders.push(r);
        if(r.rider_type=='stage')
          this.stageRider = r;
        else if(r.rider_type=='backstage')
          this.backstageRider = r;
        else if(r.rider_type=='hospitality')
          this.hospitalityRider = r;
        else if(r.rider_type=='technical')
          this.technicalRider = r;
      }
    }
  }


    confirmStageRider(){

    this.stageRider.rider_type = 'stage';

    if(!this.stageRider.is_flexible)
      this.stageRider.is_flexible = false;
    else 
      this.stageRider.is_flexible = true;
    this.Artist.artist_riders.push(this.stageRider);
    
    this.saveArtist();
    // this.updateArtistByCreateArtist();
  }

  confirmTechnicalRider(){

    this.technicalRider.rider_type = 'technical';

    if(!this.technicalRider.is_flexible)
      this.technicalRider.is_flexible = false;
    else 
      this.technicalRider.is_flexible = true;
    this.Artist.artist_riders.push(this.technicalRider);
    
    this.saveArtist();
    // this.updateArtistByCreateArtist();
  }
  loadTechnicalRiderFile($event:any){
    let target = $event.target;
    let file:File = target.files[0];
    
    for(let file of target.files)
    {
      let reader:FileReader = new FileReader();
      reader.onload = (e) =>{
        this.technicalRider.uploaded_file_base64 = reader.result;
      }
      reader.readAsDataURL(file);
    }
   
  }

  confirmBackstageRider(){

    this.backstageRider.rider_type = 'backstage';

    if(!this.backstageRider.is_flexible)
    this.backstageRider.is_flexible = false;
    else 
    this.backstageRider.is_flexible = true;
   
    this.Artist.artist_riders.push(this.backstageRider);
    
    this.saveArtist();
    // this.updateArtistByCreateArtist();
  }
  loadBackstageRiderFile($event:any){
    let target = $event.target;
    let file:File = target.files[0];
    
    for(let file of target.files)
    {
      let reader:FileReader = new FileReader();
      reader.onload = (e) =>{
        this.backstageRider.uploaded_file_base64 = reader.result;
      }
      reader.readAsDataURL(file);
    }
   
  }

  confirmHospitalityRider(){

    this.hospitalityRider.rider_type = 'hospitality';

    if(!this.hospitalityRider.is_flexible)
    this.hospitalityRider.is_flexible = false;
      else 
    this.hospitalityRider.is_flexible = true;
    
    this.Artist.artist_riders.push(this.hospitalityRider);
    
    this.saveArtist();
    // this.updateArtistByCreateArtist();
  }
  loadHospitalityRiderFile($event:any){
    let target = $event.target;
    let file:File = target.files[0];
    
    for(let file of target.files)
    {
      let reader:FileReader = new FileReader();
      reader.onload = (e) =>{
        this.hospitalityRider.uploaded_file_base64 = reader.result;
      }
      reader.readAsDataURL(file);
    }
   
  }

  saveArtist(){
    console.log(this.Artist);
    this.OnSave.emit(this.Artist);
  }

  downloadFile(data: Response){
    console.log(this.Artist.artist_riders[1].id);
    this.main.accService.GetRiderById(this.Artist.artist_riders[1].id)
    .subscribe((res)=>{
      console.log(res);
      let data2 = res.uploaded_file_base64;
      var blob = new Blob([data], { type: 'data:application/pdf' });
      var url= window.URL.createObjectURL(blob);
      window.open(url);
    })
   
  }



}

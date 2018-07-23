import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { BaseComponent } from '../../../../core/base/base.component';
import { AccountCreateModel, Rider } from '../../../../core/models/accountCreate.model';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-rider',
  templateUrl: './rider.component.html',
  styleUrls: ['./rider.component.css']
})
export class RiderComponent extends BaseComponent implements OnInit {
  @Input('Type') Type: string;
  @Input('Rider') Rider: Rider;
  @Input('Artist') Artist: AccountCreateModel;

  @Output() onDelete = new EventEmitter<number>();
  @Output() onConfirm = new EventEmitter<Rider>();

  isConfirmRider:boolean = true;

  RidersDesc = {
    'Stage' : 'Type or Upload your requirements for the Stage (Stage, Audio, Video, Lighting)',
    'Backstage'  : 'Type or Upload your requirements for the Backstage (Dressing Room/Makeup Room/Bathroom)',
    'Hospitality'  : 'Type or Upload your preference for Hospitality (Food and Drinks)',
    'Technical'  : 'Type or Upload your requirements for Musical Instruments and Equipment'
  }

  ngOnInit() {
  
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   if(changes.Rider){
  //     // console.log(`!!!`,this.Rider)
  //     if(this.Rider.id) this.isConfirmRider = true;
  //       else  this.isConfirmRider = false;
  //   }
       

  // }

  loadRiderFile($event:any){
    let target = $event.target;
    let file:File = target.files[0];
  
    for(let file of target.files)
    {
        let reader:FileReader = new FileReader();
        reader.onload = (e) =>{
        this.Rider.uploaded_file_base64 = reader.result;
        this.isConfirmRider = false;
      }
      reader.readAsDataURL(file);
    }
  }


  deleteRider(){
    this.onDelete.emit(this.Rider.id);
    this.Rider = new Rider();
    this.isConfirmRider = true;
  }



  confirmRider(){
    this.getRiderInfo();
    this.onConfirm.emit(this.Rider);
    this.isConfirmRider = true;
  }

  getRiderInfo(){
    this.Rider.rider_type = this.Type.toLowerCase();

    if(!this.Rider.is_flexible)
      this.Rider.is_flexible = false;
    else 
      this.Rider.is_flexible = true;
    // this.Artist.artist_riders.push(this.Rider);
  }

  downloadTemplate(){
    const blob = new Blob(['124'],
      { type: 'application/vnd.ms-excel;charset=utf-16le' });
     const file = new File([blob], 'template.xls',
      { type: 'application/vnd.ms-excel;charset=utf-16le' });

    //   var url = window.URL.createObjectURL(file);
      // url.download = '';
      // window.open(url);
     // saveAs(blob, filename+".txt");

     let blob2 = new Blob([], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16le"
      });

      FileSaver.saveAs(file, "template.xls"); 
  }

  downloadFile(data: Response){
    this.main.accService.GetRiderById(this.Rider.id)
    .subscribe((res)=>{
      let type = res.uploaded_file_base64.split(';base64,')[0];
      let file = res.uploaded_file_base64.split(';base64,')[1];
      var blob = new Blob([file], { type: type });
      var url = window.URL.createObjectURL(blob);
      window.open(url);
    }, (err)=>{
      // console.log(err);
    })
  }

  
}




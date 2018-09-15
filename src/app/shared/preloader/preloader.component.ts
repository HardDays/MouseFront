import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.css']
})
export class PreloaderComponent implements OnInit {

  @Input() white:boolean = false;
  @Input() size:string = '70px';
  @Input() padding:string = '150px';
  
  constructor() { }
  
  ngOnInit() {
  }

}

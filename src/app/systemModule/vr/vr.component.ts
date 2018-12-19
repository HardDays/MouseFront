import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-vr',
  templateUrl: './vr.component.html',
  styleUrls: ['./vr.component.css']
})
export class VrComponent implements OnInit {

  VRVideoLink: any;
  ContentId = 29772;

  constructor(
    protected _sanitizer     : DomSanitizer
  ) { }

  ngOnInit() {
    this.VRVideoLink = this._sanitizer.bypassSecurityTrustResourceUrl(
      'http://www.vroptimal-3dx-assets.com/content/' + this.ContentId + '?player=true&autoplay=true&referer=' + encodeURIComponent(window.location.href));
  }

}

import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { windowTime } from 'rxjs/operators';

declare var OmniVirt;
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
  ) {}

  ngOnInit() {
    this.VRVideoLink = this._sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.vroptimal-3dx-assets.com/content/' + this.ContentId + '?player=true&autoplay=true&referer=' + encodeURIComponent(window.location.href));
  }

  ngAfterViewInit() {
    var _the = this;

      OmniVirt.api.recieveMessage(window, 'load', function(type, data, iframe) {
        setTimeout(() => {
          if(_the.ContentId && _the.VRVideoLink)
            _the.fullscreen();
        }, 100);
      });

      OmniVirt.api.recieveMessage(window, 'collapsed', function(type, data, iframe) {
        console.log(`Closed`);
      });

  }

  fullscreen() {
    OmniVirt.api.sendMessage(
                'expand',
                null,
                document.getElementById('ado-'+this.ContentId)
        );
  }

}

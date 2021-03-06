import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { SettingsService } from '../../../core/services/settings.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { PreferencesModel } from '../../../core/models/preferences.model';
import { TranslateService } from '../../../../../node_modules/@ngx-translate/core';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit, OnChanges {
  @Input() UserId: number;
  @Output() OnSuccess = new EventEmitter<string>();

  Settings: PreferencesModel = new PreferencesModel();

  SettingsForm : FormGroup = new FormGroup({
    "Lang": new FormControl("", [Validators.required]),
    "DateFormat": new FormControl("", [Validators.required]),
    "Distance": new FormControl("", [Validators.required]),
    "Currency": new FormControl("", [Validators.required]),
    "TimeFormat": new FormControl("", [Validators.required])
});



  constructor(
    protected settings: SettingsService, 
    protected translate:  TranslateService,
    )
  {
    
    settings.SettingsChange.subscribe(
      (Val) => {
        this.GetSettings();
        this.translate.use(this.settings.GetLang());
      }
    );
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes)
    {
      if(changes.UserId && changes.UserId.currentValue)
      {
        this.GetSettings();
      }
    }
  }

  GetSettings()
  {
    this.Settings = this.settings.GetSettings();
  }

  SaveSettings()
  {
    this.settings.SaveSettings(this.Settings,
      (msg:string) => {
        this.OnSuccess.emit(msg);
      });
    
  }
}

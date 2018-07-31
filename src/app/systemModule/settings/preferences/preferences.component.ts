import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { SettingsService } from '../../../core/services/settings.service';
import { FormGroup, FormControl, Validators, FormArray } from '../../../../../node_modules/@angular/forms';
import { PreferencesModel } from '../../../core/models/preferences.model';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit, OnChanges {
  @Input() UserId: number;
  @Output() OnSuccess = new EventEmitter<boolean>();

  Settings: PreferencesModel = new PreferencesModel();

  SettingsForm : FormGroup = new FormGroup({
    "Lang": new FormControl("", [Validators.required]),
    "DateFormat": new FormControl("", [Validators.required]),
    "Distance": new FormControl("", [Validators.required]),
    "Currency": new FormControl("", [Validators.required]),
    "TimeFormat": new FormControl("", [Validators.required])
});



  constructor(protected settings: SettingsService)
  {
    settings.SettingsChange.subscribe(
      (Val) => {
        this.GetSettings();

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
    console.log(this.Settings);
  }

  SaveSettings()
  {
    this.settings.SaveSettings(this.Settings);
    this.OnSuccess.emit(true);
  }
}

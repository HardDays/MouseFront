import { Injectable } from "../../../../node_modules/@angular/core";
import { HttpService } from "./http.service";
import { TypeService } from "./type.service";
import { Subject } from "../../../../node_modules/rxjs";

@Injectable()
export class SettingsService{

    private SettingsContainer = "settings";
    public SettingsChange = new Subject<boolean>();

    Settings = {
        Lang: 'en',
        DateFormat: 'MMDDYYYY',
        Distance: 'mi',
        Currency : '$',
        TimeFormat: '12'
    };
    constructor(private http: HttpService, private typeService: TypeService)
    {
        this.Settings = this.GetLocalSettings();
        this.SettingsChange.next(true);
    }

    GetSettings()
    {
        return this.Settings;
    }

    SaveSettings(params:any)
    {
        this.Settings = params;
        this.SetLocalSettings();
        this.SettingsChange.next(true);
    }

    private GetLocalSettings()
    {
        const strSet = localStorage.getItem(this.SettingsContainer);
        return strSet ? JSON.parse(strSet) : this.Settings;
    }

    private SetLocalSettings()
    {
        const str = JSON.stringify(this.Settings);
        localStorage.setItem(this.SettingsContainer, str);
    }
}
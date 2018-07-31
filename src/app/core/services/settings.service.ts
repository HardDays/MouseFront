import { Injectable } from "../../../../node_modules/@angular/core";
import { HttpService } from "./http.service";
import { TypeService } from "./type.service";
import { Subject } from "../../../../node_modules/rxjs";
import { PreferencesModel } from '../models/preferences.model';

@Injectable()
export class SettingsService{

    private SettingsContainer = "settings";
    public SettingsChange = new Subject<boolean>();

    private Settings = new PreferencesModel();
    constructor(private http: HttpService, private typeService: TypeService)
    {
        this.Settings = this.GetLocalSettings();
        this.SettingsChange.next(true);
    }

    GetSettings()
    {
        return this.Settings;
    }

    GetTimeFormat()
    {
        return this.Settings.preferred_time;
    }

    GetDateFormat()
    {
        return this.Settings.preferred_date;
    }

    GetLang()
    {
        return this.Settings.preferred_username;
    }

    GetDisatance()
    {
        return this.Settings.preferred_distance;
    }

    GetCurrency()
    {
        return this.Settings.preferred_currency;
    }

    GetBackSettings()
    {
        this.http.CommonRequest(
            () => this.http.GetData("/users/preferences.json")
        )
        .subscribe(
            (res: PreferencesModel) => {
                this.SaveBackSettings(res);
            }
        );
    }

    SaveSettings(params:PreferencesModel)
    {
        this.http.CommonRequest(
            () => this.http.PatchData("/users/preferences.json", params)
        )
        .subscribe(
            (res:PreferencesModel) => {
                this.SaveBackSettings(res);
            }
        );
        
    }

    private SaveBackSettings(params:PreferencesModel)
    {
        this.Settings = params;
        this.SetLocalSettings();
        this.SettingsChange.next(true);
    }

    private GetLocalSettings()
    {
        const strSet = localStorage.getItem(this.SettingsContainer);
        return strSet ? JSON.parse(strSet) : new PreferencesModel();
    }

    private SetLocalSettings()
    {
        const str = JSON.stringify(this.Settings);
        localStorage.setItem(this.SettingsContainer, str);
    }
}
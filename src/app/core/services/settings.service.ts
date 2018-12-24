import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { TypeService } from "./type.service";
import { Subject } from "rxjs";
import { PreferencesModel } from '../models/preferences.model';

@Injectable()
export class SettingsService{

    private SettingsContainer = "settings";
    public SettingsChange = new Subject<boolean>();

    private Settings = new PreferencesModel();
    constructor(private http: HttpService)
    {
        this.Settings = this.GetLocalSettings();
        this.SettingsChange.next(true);
        // this.GetBackSettings();
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
            () => this.http.GetData("/users/preferences.json","")
        )
        .subscribe(
            (res: PreferencesModel) => {
                // console.log(res);
                this.SaveBackSettings(res);
            }
        );
    }

    SaveSettings(params:PreferencesModel, callback?:(str:string) => void)
    {
        this.http.CommonRequest(
            () => this.http.PatchData("/users/preferences.json", params)
        )
        .subscribe(
            (res:PreferencesModel) => {
                this.SaveBackSettings(res);
                if(callback && typeof callback == "function")
                {
                    callback("Success")
                }
            },
            (err) => {
                if(callback && typeof callback == "function")
                {
                    callback("Error")
                }
            }
        );
        
    }

    private SaveBackSettings(params:PreferencesModel)
    {
        this.Settings = PreferencesModel.Validate(params);
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

    public SetLocalLang(lang:string){
        this.Settings.preferred_username = lang;
        const str = JSON.stringify(this.Settings);
        localStorage.setItem(this.SettingsContainer, str);
    }
}
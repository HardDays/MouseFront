import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { ErrorComponent } from '../../shared/error/error.component';
import { ErrorModule } from '../../shared/error/error.module';
import { PreloaderModule } from '../../shared/preloader/preloader.module';
import { SettingsComponent } from './settings.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { FinancialInfoComponent } from './financial-info/financial-info.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CustomerSupportComponent } from './customer-support/customer-support.component';
import { HowToCreateEventComponent } from './customer-support/how-to-create-event/how-to-create-event.component';
import { SendQuestionComponent } from './customer-support/send-question/send-question.component';
import { PhonePipe } from '../../core/pipes/phone.pipe';
import { TranslateModule } from '@ngx-translate/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material';

@NgModule({
    imports: [ 
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TextMaskModule,
        ErrorModule,
        PreloaderModule,
        TranslateModule,
        MatSelectModule,
        MatFormFieldModule,
    ],
    declarations: [ 
        SettingsComponent,
        PersonalInfoComponent,
        PreferencesComponent,
        FinancialInfoComponent,
        FeedbackComponent,
        TermsOfServiceComponent,
        PrivacyPolicyComponent,
        CustomerSupportComponent,
        HowToCreateEventComponent,
        SendQuestionComponent
    ],
    exports: [ SettingsComponent ]
})
export class SettingsModule {}


  
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { PhonePipe } from "./phone.pipe";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        PhonePipe
    ],
    exports: [
        PhonePipe
     ]
})
export class PhonePipeModule {
  static forRoot() {
      return {
          ngModule: PhonePipeModule,
          providers: [],
      };
   }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { SystemRoutingModule } from './system.routing';

import { SystemAccessGuard } from './system.guard';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {SystemComponent} from './system.component';
import {OpenComponent} from './test-open/open.component';
@NgModule({
  declarations: [
    SystemComponent,
    OpenComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    SystemRoutingModule,
  ],
  providers: [ SystemAccessGuard]
})
export class SystemModule {}

1
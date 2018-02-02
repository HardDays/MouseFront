import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { SystemAccessGuard } from './system.guard';
import { SystemComponent } from './system.component';

import {OpenComponent} from './test-open/open.component';


const routes: Routes =
[
  {path:'',component:SystemComponent, children:
    [
      { path: 'open', component: OpenComponent, canActivate: [SystemAccessGuard] }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class SystemRoutingModule { }

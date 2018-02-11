import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { AppAccessGuard } from '../app/app.guard';
import { StupidAccessComponent } from './stupidAccess/stupidAccess.component';

const routes: Routes = [
    { path: '', redirectTo: 'access', pathMatch:'full'},
    { path: 'access',component: StupidAccessComponent, canActivate: [AppAccessGuard]},
    { path: 'system', loadChildren: './systemModule/system.module#SystemModule'},
    { path: '**', redirectTo: 'access'}
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
  providers: []
})
export class AppRoutingModule { }

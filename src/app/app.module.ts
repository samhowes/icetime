import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialModule} from "./material.module";
import {HomeLinkComponent, TopBarComponent} from './top-bar/top-bar.component';
import {FirebaseAppModule} from "ng-firebase-lite";
import {environment} from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    HomeLinkComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    MaterialModule,

    FirebaseAppModule.initializeApp(environment.firebase),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

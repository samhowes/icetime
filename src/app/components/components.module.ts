import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeLinkComponent, TopBarComponent} from "@app/components/top-bar/top-bar.component";
import {MaterialModule} from "@app/material.module";



@NgModule({
  declarations: [
    TopBarComponent,
    HomeLinkComponent,
  ],
  exports: [
    TopBarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
  ]
})
export class ComponentsModule { }

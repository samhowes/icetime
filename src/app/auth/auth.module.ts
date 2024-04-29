import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "@app/material.module";
import {AuthRoutingModule} from "@auth/auth.routing.module";
import {AuthContainerComponent} from "@auth/auth-container/auth-container.component";
import {LoginSuccessComponent} from "@auth/login-success/login-success.component";
import { AuthDialogComponent } from './auth.dialog/auth.dialog.component';
import {ComponentsModule} from "@app/components/components.module";

@NgModule({
  declarations: [
    AuthContainerComponent,
    LoginSuccessComponent,
    AuthDialogComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    MaterialModule,
    AuthRoutingModule,
  ]
})
export class AuthModule { }

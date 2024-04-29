import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {AuthContainerComponent} from "@auth/auth-container/auth-container.component";
import {LoginSuccessComponent} from "@auth/login-success/login-success.component";

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: "auth",
      pathMatch: "prefix",
      component: AuthContainerComponent,
      children: [
        {
          path: "login",
          pathMatch: "prefix",
          children: [
            {
              path: "success",
              pathMatch: "prefix",
              component: LoginSuccessComponent,
            }
          ]
        }
      ]
    },
  ])],
  exports: [RouterModule]
})
export class AuthRoutingModule {}

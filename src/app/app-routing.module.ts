import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GameListComponent} from "./game-list/game-list.component";
import {GameDetailComponent} from "./game-detail/game-detail.component";

const routes: Routes = [
  {
    path: "games",
    pathMatch: "full",
    component: GameListComponent
  },
  {
    path: "games/:id",
    pathMatch: "full",
    component: GameDetailComponent,
  },
  {
    path: "**",
    pathMatch: "full",
    redirectTo: "/games"
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { StartComponent } from './start/start.component';
import { EndComponent } from './end/end.component';

const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'start', component: StartComponent },
  { path: 'end', component: EndComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

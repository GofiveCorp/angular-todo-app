import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoComponent } from './presentation/todo/todo.component';

const routes: Routes = [
	{ path: 'todo', component: TodoComponent },
	// ...existing routes...
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
import { Routes } from '@angular/router'; // NEW
import { TodoComponent } from './presentation/todo/todo.component';

export const routes: Routes = [
	{ path: 'todo', component: TodoComponent }  // ADDED
];

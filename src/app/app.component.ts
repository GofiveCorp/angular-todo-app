import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoComponent } from "./presentation/todo/todo.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TodoComponent],
  template: `
    <router-outlet></router-outlet>
    <app-todo></app-todo>
  `
})
export class AppComponent {
  title = 'angular-todo-app';
}

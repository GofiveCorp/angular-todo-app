import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TodoService } from '../../application/todo/todo.service';
import { Todo } from '../../domain/todo/todo.model';

@Component({
  selector: 'app-todo',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h1>Angular Todo Offline App</h1>
      <form 
        class="form-inline mb-3" 
        [formGroup]="todoForm" 
        (ngSubmit)="createTodo()"
      >
        <div class="form-group mr-2">
          <label class="sr-only" for="title">Title</label>
          <input formControlName="title" id="title" placeholder="Title" required class="form-control" />
          <!-- Error message for empty title -->
          <div *ngIf="todoForm.get('title')?.invalid && todoForm.get('title')?.touched" class="text-danger">
            กรุณากรอก title
          </div>
        </div>
        <div class="form-group">
          <label class="sr-only" for="description">Description</label>
          <input formControlName="description" id="description" placeholder="Description" required class="form-control" />
        </div>
        <button type="submit" [disabled]="todoForm.invalid || loading" class="btn btn-primary ml-2 mt-2">
          <span *ngIf="loading" class="spinner-border spinner-border-sm mr-1"></span>
          {{ editingTodo ? "Update Todo" : "Add Todo" }}
        </button>
      </form>
      
      <!-- Todos list inside a card -->
      <div class="card">
        <div class="card-header">
          Todo List
        </div>
        <ul class="list-group list-group-flush">
          <li *ngFor="let todo of todos" class="list-group-item d-flex justify-content-between align-items-center mb-2">
            <!-- Changed block: added icon for completed vs. pending todo -->
            <span [ngClass]="{'text-decoration-line-through': todo.completed}">
              <i class="fa" [ngClass]="{'fa-check-circle text-success': todo.completed, 'fa-circle text-secondary': !todo.completed}" aria-hidden="true"></i>
              {{ todo.title }} - {{ todo.description }}
            </span>
            <div>
              <button (click)="prepareEdit(todo)" [disabled]="loading" class="btn btn-warning btn-sm mr-2">
                Edit
              </button>
              <button (click)="markTodoAsCompleted(todo.id)" [disabled]="todo.completed || loading" class="btn btn-success btn-sm mx-2">
                Complete
              </button>
              <button (click)="deleteTodo(todo.id)" [disabled]="loading" class="btn btn-danger btn-sm ml-2">
                Delete
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  loading = false;
  todoForm!: FormGroup;
  editingTodo: Todo | null = null; // new property to track edit mode

  constructor(private todoService: TodoService) {}

  async ngOnInit() {
    this.todoForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
    // Added: load old todos when f5 is pressed
    this.todos = await this.todoService.getTodos();
  }

  prepareEdit(todo: Todo) {
    this.editingTodo = todo;
    this.todoForm.patchValue({
      title: todo.title,
      description: todo.description
    });
  }

  async createTodo() {
    if (!this.todoForm.valid) {
      // Optionally mark controls as touched to display errors
      this.todoForm.markAllAsTouched();
      return;
    }
    const { title, description } = this.todoForm.value;
    this.loading = true;
    if (this.editingTodo) {
      // update existing todo; assume updateTodo is defined in the service
      await this.todoService.updateTodo(this.editingTodo.id, title, description);
      this.editingTodo = null;
    } else {
      await this.todoService.createTodo(title, description);
    }
    this.todos = await this.todoService.getTodos();
    this.loading = false;
    this.todoForm.reset();
  }

  async markTodoAsCompleted(id: string) {
    this.loading = true;
    await this.todoService.completeTodo(id);
    this.todos = await this.todoService.getTodos();
    this.loading = false;
  }

  async deleteTodo(id: string) {
    this.loading = true;
    await this.todoService.deleteTodo(id);
    this.todos = await this.todoService.getTodos();
    this.loading = false;
  }
}
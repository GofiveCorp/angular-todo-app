import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { TodoService } from '../../application/todo/todo.service';
import { Todo } from '../../domain/todo/todo.model';


@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h1>Angular Todo Offline App</h1>
      
      <!-- Button to open Add Todo Dialog -->
      <button (click)="openDialog()" class="btn btn-primary mb-3">Add New Todo</button>
      
      <!-- Todo Dialog -->
      <div *ngIf="showDialog" class="modal" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ editingTodo ? 'Edit' : 'Add' }} Todo</h5>
              <button type="button" class="btn-close" (click)="closeDialog()"></button>
            </div>
            <div class="modal-body">
              <form [formGroup]="todoForm" (ngSubmit)="createTodo()">
                <div class="mb-3">
                  <label for="title" class="form-label">Title</label>
                  <input formControlName="title" id="title" placeholder="Title" required class="form-control" />
                  <div *ngIf="todoForm.get('title')?.invalid && todoForm.get('title')?.touched" class="text-danger">
                    Please enter a title
                  </div>
                </div>
                <div class="mb-3">
                  <label for="description" class="form-label">Description</label>
                  <textarea formControlName="description" id="description" placeholder="Description" required class="form-control" rows="3"></textarea>
                </div>
                <div class="mb-3">
                  <label for="activityDate" class="form-label">Activity Date</label>
                  <input formControlName="activityDate" id="activityDate" type="date" required class="form-control" />
                  <div *ngIf="todoForm.get('activityDate')?.invalid && todoForm.get('activityDate')?.touched" class="text-danger">
                    Please select an activity date
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" (click)="closeDialog()">Cancel</button>
                  <button type="submit" [disabled]="todoForm.invalid || loading" class="btn btn-primary">
                    <span *ngIf="loading" class="spinner-border spinner-border-sm mr-1"></span>
                    {{ editingTodo ? "Update" : "Add" }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Todos list inside a card -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>Todo List</span>
        </div>
        <ul class="list-group list-group-flush">
          <li *ngFor="let todo of todos" class="list-group-item d-flex justify-content-between align-items-center mb-2">
            <!-- Changed block: added icon for completed vs. pending todo -->
            <span [ngClass]="{'text-decoration-line-through': todo.completed}">
              <i class="fa" [ngClass]="{'fa-check-circle text-success': todo.completed, 'fa-circle text-secondary': !todo.completed}" aria-hidden="true"></i>
              {{ todo.title }} - {{ todo.description }}
              <br>
              <small class="text-muted">
                {{ todo.activityDate ? ('Activity Date: ' + (todo.activityDate | date:'mediumDate')) : '' }}
                {{ todo.activityDate ? ' | ' : '' }}
                {{ todo.updatedAt ? ('Updated: ' + (todo.updatedAt | date:'short')) : ('Created: ' + (todo.createdAt | date:'short')) }}
              </small>
            </span>
            <div>
              <button (click)="openDialog(todo)" [disabled]="loading" class="btn btn-warning btn-sm mr-2">
                Edit
              </button>
              <button (click)="markTodoAsCompleted(todo.id)" [disabled]="todo.completed || loading" class="btn btn-success btn-sm mx-2">
                Complete
              </button>
              <button (click)="confirmDelete(todo.id)" [disabled]="loading" class="btn btn-danger btn-sm ml-2">
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
  editingTodo: Todo | null = null; // property to track edit mode
  showDialog = false; // property to control dialog visibility

  constructor(private todoService: TodoService) {}

  async ngOnInit() {
    this.todoForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      activityDate: new FormControl(null, Validators.required)
    });
    // Added: load old todos when f5 is pressed
    this.todos = await this.todoService.getTodos();
  }

  openDialog(todo?: Todo) {
    this.todoForm.reset();
    
    if (todo) {
      this.editingTodo = todo;
      this.todoForm.patchValue({
        title: todo.title,
        description: todo.description,
        activityDate: todo.activityDate
      });
    } else {
      this.editingTodo = null;
    }
    
    this.showDialog = true;
  }
  
  closeDialog() {
    this.showDialog = false;
    this.todoForm.reset();
    this.editingTodo = null;
  }

  async createTodo() {
    if (!this.todoForm.valid) {
      // Optionally mark controls as touched to display errors
      this.todoForm.markAllAsTouched();
      return;
    }
    const { title, description, activityDate } = this.todoForm.value;
    this.loading = true;
    if (this.editingTodo) {
      // update existing todo with updatedAt value so storage keeps the date updated
      await this.todoService.updateTodo(this.editingTodo.id, title, description, new Date(), activityDate);
      this.editingTodo = null;
    } else {
      await this.todoService.createTodo(title, description, activityDate);
    }
    this.todos = await this.todoService.getTodos();
    this.loading = false;
    this.todoForm.reset();
    this.closeDialog();
  }

  async markTodoAsCompleted(id: string) {
    this.loading = true;
    await this.todoService.completeTodo(id);
    this.todos = await this.todoService.getTodos();
    this.loading = false;
  }

  async confirmDelete(id: string) {
    if (confirm('Are you sure you want to delete this todo?')) {
      await this.deleteTodo(id);
    }
  }

  async deleteTodo(id: string) {
    this.loading = true;
    await this.todoService.deleteTodo(id);
    this.todos = await this.todoService.getTodos();
    this.loading = false;
  }
}
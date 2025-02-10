import { Injectable } from '@angular/core';
import { Todo } from '../../domain/todo/todo.model';
import { TodoRepository } from '../../domain/todo/todo.repository';
import { OfflineTodoRepository } from '../../infrastructure/todo.repository.offline';
import { TodoCreated, TodoUpdated, TodoDeleted, TodoCompleted } from '../../domain/todo/todo.events';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todoRepository: TodoRepository;

  constructor() {
    // Use the offline repository implementation.
    this.todoRepository = new OfflineTodoRepository();
  }

  async createTodo(title: string, description: string): Promise<void> {
    const todo = new Todo(uuidv4(), title, description);
    await this.todoRepository.create(todo);
    this.publishEvent(new TodoCreated(todo.id, title));
  }

  async updateTodo(id: string, title: string, description: string): Promise<void> {
    const todo = await this.todoRepository.getById(id);
    if (!todo) throw new Error('Todo not found');
    // Directly update the fields instead of calling a non-existent method
    todo.title = title;
    todo.description = description;
    await this.todoRepository.update(todo);
    this.publishEvent(new TodoUpdated(todo.id, title));
  }

  async deleteTodo(id: string): Promise<void> {
    await this.todoRepository.delete(id);
    this.publishEvent(new TodoDeleted(id));
  }

  async completeTodo(id: string): Promise<void> {
    await this.todoRepository.complete(id);
    this.publishEvent(new TodoCompleted(id));
  }

  async getTodos(): Promise<Todo[]> {
    return this.todoRepository.getAll();
  }

  private publishEvent(event: any) {
    // Simple event dispatching mechanism.
    console.log('Event Published:', event);
  }
}
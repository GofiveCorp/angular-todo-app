
import { Todo } from '../domain/todo/todo.model';
import { TodoRepository } from '../domain/todo/todo.repository';

export class OfflineTodoRepository implements TodoRepository {
  private storageKey = 'todos';

  private async getTodosFromStorage(): Promise<Todo[]> {
    const raw = localStorage.getItem(this.storageKey);
    return raw ? JSON.parse(raw) : [];
  }

  private async saveTodosToStorage(todos: Todo[]): Promise<void> {
    localStorage.setItem(this.storageKey, JSON.stringify(todos));
  }

  async create(todo: Todo): Promise<void> {
    const todos = await this.getTodosFromStorage();
    todos.push(todo);
    await this.saveTodosToStorage(todos);
  }

  async update(todo: Todo): Promise<void> {
    let todos = await this.getTodosFromStorage();
    todos = todos.map((t: Todo) => (t.id === todo.id ? todo : t));
    await this.saveTodosToStorage(todos);
  }

  async delete(todoId: string): Promise<void> {
    let todos = await this.getTodosFromStorage();
    todos = todos.filter((t: Todo) => t.id !== todoId);
    await this.saveTodosToStorage(todos);
  }

  async complete(todoId: string): Promise<void> {
    let todos = await this.getTodosFromStorage();
    todos = todos.map((t: Todo) => {
      if (t.id === todoId) {
        t.completed = true;
        t.updatedAt = new Date();
      }
      return t;
    });
    await this.saveTodosToStorage(todos);
  }

  async getById(todoId: string): Promise<Todo | null> {
    const todos = await this.getTodosFromStorage();
    return todos.find((t: Todo) => t.id === todoId) || null;
  }

  async getAll(): Promise<Todo[]> {
    return this.getTodosFromStorage();
  }
}

import { Todo } from './todo.model';

export interface TodoRepository {
  create(todo: Todo): Promise<void>;
  update(todo: Todo): Promise<void>;
  delete(todoId: string): Promise<void>;
  complete(todoId: string): Promise<void>;
  getById(todoId: string): Promise<Todo | null>;
  getAll(): Promise<Todo[]>;
}
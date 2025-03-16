
export class Todo {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public completed: boolean = false,
    public activityDate: Date,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  update(title: string, description: string, activityDate: Date) {
    this.title = title;
    this.description = description;
    this.activityDate = activityDate;
    this.updatedAt = new Date();
    // ...trigger TodoUpdated event...
  }

  complete() {
    this.completed = true;
    this.updatedAt = new Date();
    // ...trigger TodoCompleted event...
  }
}
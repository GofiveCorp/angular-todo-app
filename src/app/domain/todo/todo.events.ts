
export class TodoCreated {
  constructor(public todoId: string, public title: string) {}
}

export class TodoUpdated {
  constructor(public todoId: string, public title: string) {}
}

export class TodoDeleted {
  constructor(public todoId: string) {}
}

export class TodoCompleted {
  constructor(public todoId: string) {}
}
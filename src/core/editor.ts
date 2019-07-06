export class Editor {
  public id: string;
  public items: any[] = [];

  constructor(id?: string) {
    this.id = id || `${Date.now()}_${Math.round(Math.random() * 10000)}`;
  }
}

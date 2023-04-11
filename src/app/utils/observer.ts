export interface Observer {
  updateFromSubject(): void;
}

export interface Subject {
  subscribe(): void;
  unSubscribe(): void;
}

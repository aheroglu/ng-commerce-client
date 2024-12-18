export class ResultModel<T> {
  successMessage?: string;
  errorMessages?: string[] = [];
  data?: T;

  constructor(successMessage?: string, errorMessages?: [], data?: T) {
    this.successMessage = successMessage;

    if (errorMessages) {
      this.errorMessages = errorMessages;
    }

    this.data = data;
  }

  addErrorMessages(message: string) {
    this.errorMessages?.push(message);
  }
}

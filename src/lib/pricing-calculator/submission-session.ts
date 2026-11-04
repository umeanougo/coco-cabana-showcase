// Shared by the UI and delayed-response regression tests. Every edit invalidates old replies.
export class SubmissionSession {
  private generation = 0;
  start() {
    return ++this.generation;
  }
  invalidate() {
    ++this.generation;
  }
  accepts(token: number) {
    return token === this.generation;
  }
}

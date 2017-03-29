import ExtensibleError from 'es6-error';

export class AssertionError extends ExtensibleError {
  constructor() {
    // Generate a better message
    const stack = (new Error()).stack;
    const line = stack.split('\n').map((s) => s.trim())[3];
    const location = line.split(' ')[1];

    // Load it into super.
    const message = `Assertion Error at ${location}`;
    super(message);
  }
}

export default function assert(condition, message) {
  if (!condition) {
    throw new AssertionError(message);
  }
}

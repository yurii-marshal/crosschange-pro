import { SafePipe } from './safe.pipe';

describe('SafePipe', () => {
  it('create an instance', () => {
    const sanitizer = null;
    const pipe = new SafePipe(sanitizer);
    expect(pipe).toBeTruthy();
  });
});

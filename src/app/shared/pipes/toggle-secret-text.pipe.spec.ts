import { ToggleSecretTextPipe } from './toggle-secret-text.pipe';

describe('Pipe: ToggleSecretTextPipe', () => {
  const pipe = new ToggleSecretTextPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return undefined when providing type undefined', () => {
    expect(pipe.transform(undefined, true)).toBe(undefined);
  });

  it('should return string when providing string with flag FALSE', () => {
    expect(pipe.transform('some text', false)).toBe('some text');
  });

  it('should return asterisks when providing string without flag', () => {
    expect(pipe.transform('some text')).toBe('*********');
  });

  it('should return asterisks when providing string with flag TRUE', () => {
    expect(pipe.transform('some text', true)).toBe('*********');
  });
});

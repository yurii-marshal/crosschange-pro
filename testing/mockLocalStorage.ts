export function mockLocalStorage(): void {
  let store = {};

  spyOn(localStorage, 'getItem').and.callFake( (key: string): string => {
    return store[key] || null;
  });
  spyOn(localStorage, 'removeItem').and.callFake((key: string): void =>  {
    delete store[key];
  });
  spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string =>  {
    return store[key] = (value as string);
  });
  spyOn(localStorage, 'clear').and.callFake(() =>  {
    store = {};
  });
}

const cacheMap = new Map();

export interface Config {
  resolver?: (...args: any[]) => string | number;
  ttl?: number;
}

export function Memoized(config: Config = {}): any {
  return (
    target: object,
    propertyName: string,
    propertyDescriptor: PropertyDescriptor
  ): PropertyDescriptor => {
    let timeout = Infinity;
    const prop = propertyDescriptor.value ? 'value' : 'get';

    const originalFunction = propertyDescriptor[prop];
    const map = new Map();

    propertyDescriptor[prop] = function(...args): () => any {
      const key = config.resolver
        ? config.resolver.apply(this, args)
        : JSON.stringify(args);

      if (map.has(key) && (!config.ttl || timeout > Date.now())) {
        return map.get(key);
      } else {
        const result = originalFunction.apply(this, args);
        map.set(key, result);
        if (config.ttl) {
          timeout = Date.now() + config.ttl;
        }
        return result;
      }
    };

    cacheMap.set(propertyDescriptor[prop], map);

    return propertyDescriptor;
  };
}

export function clear(fn: () => any): void {
  const map = cacheMap.get(fn);

  if (map) {
    map.clear();
  }
}

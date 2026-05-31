export function createMockRegistry() {
  const restorers = [];

  function replace(target, property, implementation) {
    const original = target[property];
    target[property] = implementation;
    restorers.push(() => {
      target[property] = original;
    });
  }

  function restoreAll() {
    while (restorers.length > 0) {
      restorers.pop()();
    }
  }

  return {
    replace,
    restoreAll
  };
}

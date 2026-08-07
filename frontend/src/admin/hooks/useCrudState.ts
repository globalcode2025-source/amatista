import { useState } from 'react';

export function useCrudState<T extends { id: string }>(seed: T[]) {
  const [items, setItems] = useState<T[]>(seed);

  const add = (item: Omit<T, 'id'>) => {
    const withId = { ...item, id: crypto.randomUUID() } as T;
    setItems((prev) => [withId, ...prev]);
  };

  const update = (id: string, patch: Partial<T>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return { items, add, update, remove };
}
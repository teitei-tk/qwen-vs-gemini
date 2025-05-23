'use client';

import { useState } from 'react';

interface Item {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export default function Estimator() {
  const [items, setItems] = useState<Item[]>([
    { id: Date.now(), name: '', quantity: 1, price: 0 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), name: '', quantity: 1, price: 0 },
    ]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: 'name' | 'quantity' | 'price', value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const total = items.reduce((sum, item) => {
    const q = parseFloat(item.quantity.toString());
    const p = parseFloat(item.price.toString());
    return sum + (isNaN(q) || isNaN(p) ? 0 : q * p);
  }, 0);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">見積もり電卓</h1>
      <form className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row gap-2 p-3 bg-white border rounded-md shadow-sm"
          >
            <input
              type="text"
              placeholder="商品名"
              value={item.name}
              onChange={(e) => updateItem(item.id, 'name', e.target.value)}
              className="flex-1 p-2 border rounded text-sm"
            />
            <input
              type="number"
              min="0"
              step="1"
              value={item.quantity}
              onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
              className="w-20 p-2 border rounded text-sm"
            />
            <input
              type="number"
              min="0"
              step="any"
              value={item.price}
              onChange={(e) => updateItem(item.id, 'price', e.target.value)}
              className="w-24 p-2 border rounded text-sm"
            />
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              削除
            </button>
          </div>
        ))}
      </form>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={addItem}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          商品を追加
        </button>
      </div>
      <div className="text-right text-xl font-bold">
        合計金額: ¥{total.toLocaleString()}
      </div>
    </div>
  );
}

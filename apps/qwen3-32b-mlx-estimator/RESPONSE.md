<think>
Okay, I need to create a simple estimation calculator using Next.js (App Router) and TypeScript. Let me think about how to approach this.

First, the requirements: each product needs a name, quantity, and unit price. The total should be calculated automatically, and the user should be able to add or remove items. Also, no data persistence is needed, so state management with React's useState or useReducer should be sufficient.

For the UI, since there's no specific library required, I can just use basic HTML and CSS. I'll need input fields for each product line, with validation to ensure numbers are entered correctly. Maybe using the 'number' type input for quantity and unit price, with min values to prevent negative numbers.

Using useState makes sense here. I can store an array of items in the state, each containing name, quantity, and price. When a user adds a new item, I push a new object into the array. For deletion, I can filter out the index of the item to remove.

Calculating the total: each time an input changes, I compute the sum of all quantity * price. The reducer might be overkill here since it's a simple state structure, so using useState with the array and recalculating on each render should work.

Validation: check if quantity or price is a valid number. Maybe set a minimum of 0, and display errors if they try to enter negative numbers or non-numeric values.

Styling: Keep it simple with flexbox for each row, maybe some padding and borders to make the inputs look clean. The total should be highlighted at the bottom.

Let me structure the code:

- Define a state with useState that holds an array of items.
- Functions to add and remove items from the array.
- For each item, input fields that update their respective properties in the state.
- When inputs change, the total is recalculated by summing all (quantity * price).
- Prevent negative numbers and non-number inputs.

Wait, for each input change, I need a way to update the specific item in the array. Maybe create an onChange handler that takes index, field name, and value, then creates a new array with the updated item.

Testing cases:
- Adding multiple items.
- Changing quantity or price updates total correctly.
- Deleting an item removes its contribution to the total.

Now, implement all this in a single file (page.tsx) using Next.js App Router. Since it's the app directory, I'll use React Server Components by default, but since there's no server action needed here, it should be okay.

Putting it all together: the component will render a form with dynamic fields based on the state array. Each row has three inputs, and buttons to add or remove rows. The total is displayed below.

Potential issues: handling the key correctly for each row to avoid React warnings. Using index as a key might not be ideal, but since the items are dynamic and don't have unique IDs anyway, it's acceptable for this simple app.

Also, initial state: start with one empty item to allow the user to begin entering data immediately. Or maybe two items as defaults? The example can start with one.

Validation: Should I show error messages if the user enters invalid data? The requirement says to have input validation, so maybe adding a check that quantity and price are numbers >=0. If not valid, the total could be 0 or display an error.

But since it's a simple app, maybe just ensure that the inputs only accept numbers. The input type is number with min 0, which should handle basic validation.

Now code:

Import React hooks and define the page component as default.

Define the initial state with an array containing at least one item.

Create handlers for adding new items (defaulting name to empty, quantity and price to 0).

RemoveItem function that filters the array by index.

UpdateItem handler that takes index, field (name or quantity or price), and value. Then creates a new array with the item updated.

Calculate total by reducing through each item, multiplying quantity and price. If any of them are invalid (like empty or non-number), treat as 0? Or skip that item?

In the render, map over items and create input fields. Each field is controlled by React's state.

Styling with CSS-in-JS or inline styles for simplicity. Maybe a form with a flex layout, each row as a flex container.

Testing the total: if all inputs are numbers, it should sum correctly. If user leaves name empty but that's not required for total.

Wait, the total is sum of quantity * price. So name isn't needed for calculation, just quantity and price.

So even if a row is empty in some fields (like name), the code will still calculate as long as quantity and price are valid numbers.

That's acceptable for a simple app.

Now writing the code with these considerations.
</think>



```tsx
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
```

---

### 実装設計の説明

この見積もり電卓は、Next.js App RouterとTypeScriptでコンポーネント駆動のシンプルな実装を採用しています。商品行ごとに「商品名」「数量」「単価」の入力欄を持たせ、各フィールドを`useState`で管理しています。データ構造は`Item`インターフェースで定義し、各商品に一意なIDを割り当てています。これにより行削除時の識別やReactの再レンダリングの最適化が容易になります。

**状態管理と計算ロジックにおいては以下のような設計選択をしています：**
1. **`useState<Item[]>`を使用**: 可変長の商品リストを配列で保持し、各操作に応じて更新します。1行あたりの変更には`.map()`を、追加・削除には`.push()`や`.filter()`を使用しています。
2. **変数の実行時バリデーション**: 数量や単価が非数値だった場合、`reduce()`内で`NaN`を0として扱うことで合計金額の計算に誤りが起こらないようにしています。
3. **UI・UX設計**: レスポンシブなレイアウトで入力欄を配置し、必要最小限のスタイルとボタン付き削除機能で直感的な操作性を実現しました。合計金額は明確なフォントと右寄せで強調しています。

この設計により、リロード時以外は状態の永続化が不要な簡易見積もりアプリを、Reactの持つhooksによる声明的プログラミングで実現できました。
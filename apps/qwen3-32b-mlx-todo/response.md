<think>
Alright, the user wants a simple TODO app using Next.js App Router and TypeScript in one page. Let me start by recalling how the App Router works with React Server Components. Since data persistence isn't needed, everything should be handled on the client side using React's hooks.

For state management, useState is straightforward. I'll create a list of tasks as an array and manage each task's title, id, editing status. Each task needs a unique key when rendering the list.

The UI should be user-friendly, so I'll include an input for adding tasks and buttons to add, edit, or delete. When editing, a field will appear where the user can modify the title and then update it.

I need to make sure that components are modular. Maybe create a Task component for each task item, handling its own edit state and updating the parent list. Also, using inline styles for simplicity since no UI library is required.

Wait, but in Next.js App Router, the page is Server Component by default. To use client-side interactivity, I need to add 'use client' at the top and wrap in a Client Component. So all the React hooks will be within that.

Check if the form submission is handled correctly, using a function to create new tasks. Edit mode toggles between display text and input field. When editing, the task is updated in the state.

Make sure to handle IDs properly. Using a timestamp might be sufficient since persistence isn't needed. For deletion, filter the task by ID.

Testing each function: add, edit, delete. Also, validation for empty tasks when adding or saving edits.

Styling with simple CSS modules or inline styles. Maybe use flexbox for layout, some padding and colors to differentiate elements.

Finally, all code in one file: app/page.tsx. Import React and use the necessary hooks. Export a default function which renders everything.

Double-checking if all requirements are met: no libraries, only one page file, using React hooks. Also ensure the UI is intuitive with clear buttons and inputs.
</think>



```tsx
'use client'

import { useState } from 'react';

export default function TodoPage() {
  // タスクの状態を管理
  const [tasks, setTasks] = useState<Array<{ id: number; title: string }>>([
    { id: Date.now(), title: '例: タスクを入力' },
  ]);

  // 新規タスクのタイトルを管理
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');

  // 編集中のタスクIDを管理
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  // 編集中のタスクタイトルを管理
  const [editingTitle, setEditingTitle] = useState<string>('');

  // タスクを追加
  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') return;

    setTasks([...tasks, { id: Date.now(), title: newTaskTitle }]);
    setNewTaskTitle('');
  };

  // タスクを削除
  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // 編集を開始
  const handleEditTask = (id: number, title: string) => {
    setEditingTaskId(id);
    setEditingTitle(title);
  };

  // 編集を保存
  const handleSaveEdit = (id: number) => {
    if (editingTitle.trim() === '') return;

    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, title: editingTitle } : task
      )
    );

    setEditingTaskId(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>TODOアプリ</h1>

      {/* 新規タスク入力 */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="新しいタスクを入力..."
          style={styles.input}
        />
        <button onClick={handleAddTask} style={styles.button}>
          追加
        </button>
      </div>

      {/* タスクリスト */}
      <ul style={styles.taskList}>
        {tasks.map(task => (
          <li key={task.id} style={styles.taskItem}>
            {editingTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  style={styles.editInput}
                />
                <button
                  onClick={() => handleSaveEdit(task.id)}
                  style={styles.saveButton}
                >
                  保存
                </button>
              </>
            ) : (
              <>
                <span style={styles.taskText}>{task.title}</span>
                <div style={styles.buttonGroup}>
                  <button
                    onClick={() => handleEditTask(task.id, task.title)}
                    style={styles.editButton}
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={styles.deleteButton}
                  >
                    削除
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// シンプルなスタイル
const styles = {
  container: {
    maxWidth: '500px',
    margin: '2rem auto',
    padding: '1.5rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    fontFamily: '-apple-system, BlinkMacSystemFont',
  },
  header: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
  },
  inputContainer: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  input: {
    flex: 1,
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  taskList: {
    listStyleType: 'none',
    padding: 0,
  },
  taskItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #eee',
  },
  taskText: {
    flex: 1,
    wordBreak: 'break-all',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem',
  },
  editButton: {
    padding: '0.375rem 0.625rem',
    backgroundColor: '#2196F3',
    color: 'white',
  },
  deleteButton: {
    padding: '0.375rem 0.625rem',
    backgroundColor: '#f44336',
    color: 'white',
  },
  editInput: {
    flex: 1,
    padding: '0.375rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  saveButton: {
    padding: '0.375rem 0.625rem',
    backgroundColor: '#FF9800',
    color: 'white',
  },
};
```

### 実装の設計思想

1. **シンプルな React フックによる実装**
   - `useState`でタスクリスト・新規入力値・編集状態をそれぞれ独立して管理することで、関心の分離と可読性を保ちました。
   - 各操作（追加・削除・編集）は明確な関数として分離し、一貫した状態管理を行っています。
   - `id`の生成にタイムスタンドを使用することで、ページリライフールで状態が消えることを前提としたシンプルな実装にしています。

2. **UIの使いやすさと可読性**
   - 横並びレイアウト（`flex`）でタスク情報と操作ボタングループを配置し、視覚的な整理を図りました。
   - 編集モードでは入力欄が自然に置き換えられ、直感的な操作を可能にしました。
   - 固有の色（緑: 追加、青: 編集、赤: 削除）をボタンに割り当てるなど、操作の種類を視覚的に区別しやすくしています。
   - 簡潔なスタイルで全体の見やすさを維持しつつも、影や余白によるビジュアルルーティンを意識しました。
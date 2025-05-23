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

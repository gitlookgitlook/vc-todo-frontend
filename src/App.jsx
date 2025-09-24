import { useState, useEffect } from "react";
import "./App.css";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import { getTodos, createTodo, updateTodo, toggleTodo, deleteTodo } from "./services/todoService";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 할일 목록 불러오기
  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTodos();
      setTodos(response.data || []);
    } catch (error) {
      console.error("할일 목록 로드 오류:", error);
      setError("할일 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 할일 목록 로드
  useEffect(() => {
    loadTodos();
  }, []);

  // 할일 추가
  const handleAddTodo = async (todoData) => {
    try {
      const response = await createTodo(todoData);
      setTodos((prevTodos) => [response.data, ...prevTodos]);
    } catch (error) {
      console.error("할일 추가 오류:", error);
      throw error;
    }
  };

  // 할일 수정
  const handleUpdateTodo = async (id, todoData) => {
    try {
      const response = await updateTodo(id, todoData);
      setTodos((prevTodos) => prevTodos.map((todo) => (todo._id === id ? response.data : todo)));
    } catch (error) {
      console.error("할일 수정 오류:", error);
      throw error;
    }
  };

  // 할일 완료 상태 토글
  const handleToggleTodo = async (id) => {
    try {
      const response = await toggleTodo(id);
      setTodos((prevTodos) => prevTodos.map((todo) => (todo._id === id ? response.data : todo)));
    } catch (error) {
      console.error("할일 상태 변경 오류:", error);
      throw error;
    }
  };

  // 할일 삭제
  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("할일 삭제 오류:", error);
      throw error;
    }
  };

  // 에러 상태 표시
  if (error) {
    return (
      <div className="app">
        <div className="error-state">
          <h2>❌ 오류가 발생했습니다</h2>
          <p>{error}</p>
          <button onClick={loadTodos} className="retry-btn">
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 VIBE-CODING TODOLIST</h1>
        <p>할일을 관리하고 생산성을 높여보세요!</p>
      </header>

      <main className="app-main">
        <section className="todo-form-section">
          <h2>새 할일 추가</h2>
          <TodoForm onAddTodo={handleAddTodo} />
        </section>

        <section className="todo-list-section">
          <h2>할일 목록</h2>
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>할일을 불러오는 중...</p>
            </div>
          ) : (
            <TodoList
              todos={todos}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onUpdateTodo={handleUpdateTodo}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

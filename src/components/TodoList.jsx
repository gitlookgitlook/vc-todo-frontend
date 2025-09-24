import { useState, useEffect, useRef } from "react";
import "./TodoList.css";
import TodoItem from "./TodoItem";

const TodoList = ({ todos, onToggle, onDelete, onUpdateTodo }) => {
  const [displayedTodos, setDisplayedTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef(null);
  const ITEMS_PER_PAGE = 5;

  // 초기 로드 및 todos 변경 시 처리
  useEffect(() => {
    setDisplayedTodos(todos.slice(0, ITEMS_PER_PAGE));
    setHasMore(todos.length > ITEMS_PER_PAGE);
  }, [todos]);

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

    if (isNearBottom) {
      loadMoreTodos();
    }
  };

  // 더 많은 할일 로드
  const loadMoreTodos = () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // 실제로는 API 호출이지만, 여기서는 시뮬레이션
    setTimeout(() => {
      const currentLength = displayedTodos.length;
      const nextBatch = todos.slice(currentLength, currentLength + ITEMS_PER_PAGE);

      setDisplayedTodos((prev) => [...prev, ...nextBatch]);
      setHasMore(currentLength + ITEMS_PER_PAGE < todos.length);
      setIsLoading(false);
    }, 500);
  };

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>할일이 없습니다</h3>
        <p>새로운 할일을 추가해보세요!</p>
      </div>
    );
  }

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="todo-list">
      <div className="todo-stats">
        <div className="stats-item">
          <span className="stats-label">전체</span>
          <span className="stats-value">{totalCount}</span>
        </div>
        <div className="stats-item">
          <span className="stats-label">완료</span>
          <span className="stats-value completed">{completedCount}</span>
        </div>
        <div className="stats-item">
          <span className="stats-label">진행률</span>
          <span className="stats-value">{progressPercentage}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <div className="todos-container" ref={scrollContainerRef} onScroll={handleScroll}>
        {displayedTodos.map((todo) => (
          <TodoItem key={todo._id} todo={todo} onToggle={onToggle} onDelete={onDelete} onUpdateTodo={onUpdateTodo} />
        ))}

        {isLoading && (
          <div className="loading-more">
            <div className="loading-spinner"></div>
            <p>더 많은 할일을 불러오는 중...</p>
          </div>
        )}

        {!hasMore && displayedTodos.length > 0 && (
          <div className="no-more-todos">
            <p>모든 할일을 불러왔습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;

import { useState } from "react";
import "./TodoItem.css";

const TodoItem = ({ todo, onToggle, onDelete, onUpdateTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);

  const handleToggle = async () => {
    try {
      await onToggle(todo._id);
    } catch (error) {
      console.error("상태 변경 오류:", error);
      alert("상태 변경에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 이 할일을 삭제하시겠습니까?")) {
      try {
        await onDelete(todo._id);
      } catch (error) {
        console.error("삭제 오류:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      alert("할일 제목을 입력해주세요.");
      return;
    }

    try {
      await onUpdateTodo(todo._id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        completed: todo.completed,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("수정 오류:", error);
      alert("수정에 실패했습니다.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  // ESC 키로 수정 취소
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="edit-title-input"
            maxLength={100}
            placeholder="할일 제목을 입력하세요"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            className="edit-description-input"
            rows={2}
            maxLength={500}
            placeholder="상세 설명 (선택사항)"
          />
          <div className="edit-actions">
            <button onClick={handleSaveEdit} className="save-btn">
              💾 저장
            </button>
            <button onClick={handleCancelEdit} className="cancel-btn">
              ❌ 취소
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="todo-content">
            <div className="todo-header">
              <h3 className={`todo-title ${todo.completed ? "completed" : ""}`}>{todo.title}</h3>
              <div className="todo-actions">
                <button onClick={handleEdit} className="edit-btn" title="수정">
                  ✏️
                </button>
                <button onClick={handleDelete} className="delete-btn" title="삭제">
                  🗑️
                </button>
              </div>
            </div>

            {todo.description && (
              <p className={`todo-description ${todo.completed ? "completed" : ""}`}>{todo.description}</p>
            )}
          </div>

          <div className="todo-status">
            <button onClick={handleToggle} className={`toggle-btn ${todo.completed ? "completed" : "pending"}`}>
              {todo.completed ? "✅ 완료" : "⏳ 진행중"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;

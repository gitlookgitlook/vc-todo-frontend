import { useState } from "react";
import "./TodoForm.css";

const TodoForm = ({ onAddTodo }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("할일 제목을 입력해주세요.");
      return;
    }

    try {
      await onAddTodo({
        title: title.trim(),
        description: description.trim(),
      });

      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("할일 저장 오류:", error);
      alert("할일 저장에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          placeholder="할일 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <textarea
          placeholder="상세 설명 (선택사항)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="description-input"
          rows={3}
          maxLength={500}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          추가하기
        </button>
      </div>
    </form>
  );
};

export default TodoForm;

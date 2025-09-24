const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/todos ";

// API 통신을 위한 기본 함수
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API 요청 실패");
    }

    return data;
  } catch (error) {
    console.error("API 요청 오류:", error);
    throw error;
  }
};

// 할일 목록 조회
export const getTodos = async () => {
  return await apiRequest("/todos");
};

// 할일 상세 조회
export const getTodo = async (id) => {
  return await apiRequest(`/todos/${id}`);
};

// 할일 생성
export const createTodo = async (todoData) => {
  return await apiRequest("/todos", {
    method: "POST",
    body: JSON.stringify(todoData),
  });
};

// 할일 수정
export const updateTodo = async (id, todoData) => {
  return await apiRequest(`/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify(todoData),
  });
};

// 할일 완료 상태 토글
export const toggleTodo = async (id) => {
  return await apiRequest(`/todos/${id}/toggle`, {
    method: "PATCH",
  });
};

// 할일 삭제
export const deleteTodo = async (id) => {
  return await apiRequest(`/todos/${id}`, {
    method: "DELETE",
  });
};

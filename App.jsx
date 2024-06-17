
import { useState, useEffect } from "react";
import Todo from "./Todo";
import "./App.css";
import TodoForm from "./TodoForm";

function App() {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTodo, setCurrentTodo] = useState({})

  useEffect(() => {
    fetchTodos()
  }, []);

  const fetchTodos = async () => {
    const response = await fetch("http://127.0.0.1:5000/todo");
    const data = await response.json();
    setTodos(data.todos);
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentTodo({})
  }

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true)
  }

  const openEditModal = (todo) => {
    if (isModalOpen) return
    setCurrentTodo(todo)
    setIsModalOpen(true)
  }

  const onUpdate = () => {
    closeModal()
    fetchTodos()
  }

  return (
    <>
      <Todo todos={todos} updateTodo={openEditModal} updateCallback={onUpdate} />
      <button onClick={openCreateModal}>Create New Todo</button>
      {isModalOpen && <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <TodoForm existingTodo={currentTodo} updateCallback={onUpdate} />
        </div>
      </div>
      }
    </>
  );
}

export default App;

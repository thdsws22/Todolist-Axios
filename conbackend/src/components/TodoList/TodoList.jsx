import React, { useEffect, useState } from "react";
import { List, Row, Col, Typography, Button, Input } from "antd"; // Import Input from antd
import { fetchTodos, addTodo, deleteTodo, updateTodo } from "./Todo";

export default function TodoList() {
  const [todoList, setTodoList] = useState([]);
  const [inputField, setInputField] = useState(""); // State for input field
  const [editingId, setEditingId] = useState(null); // For editing todo items
  const [editInputFields, setEditInputFields] = useState({}); // State for edit input fields

  const fetchTodoList = async () => {
    try {
      const todos = await fetchTodos();
      setTodoList(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodoList(); // Fetch todos on component mount
  }, []);

  // Function to add new todo item
  const handleAddTodo = async () => {
    if (inputField.trim()) {
      const newTodo = await addTodo(inputField);
      setTodoList([...todoList, newTodo]); // Add new todo to the list
      setInputField(""); // Clear input field after adding
    }
  };

  // Function to delete a todo item
  const handleDeleteTodo = async (id) => {
    await deleteTodo(id); // Call the delete function
    setTodoList(todoList.filter((todo) => todo.id !== id)); // Remove the item with the specified id
  };

  // Function to start editing
  const startEditing = (item) => {
    setEditingId(item.id);
    setEditInputFields({ ...editInputFields, [item.id]: item.task });
  };

  // Function to update todo item
  const handleUpdateTodo = async (id) => {
    await updateTodo(id, editInputFields[id]);
    setTodoList(todoList.map((todo) => (todo.id === id ? { ...todo, task: editInputFields[id] } : todo)));
    setEditingId(null);
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: "16px" }}>
        <Col span={24}>
          <Typography.Text
            type="warning" // Use Ant Design Typography warning type
            style={{ textAlign: "left", display: "block", fontSize: "16px" }} // Optional custom styles
          >
            Please add task...
          </Typography.Text>
        </Col>
        <Col span={18}>
          <Input
            value={inputField}
            onChange={(e) => setInputField(e.target.value)} // Handle input change
            placeholder="Add a new task"
            style={{ width: "95%", padding: "8px" }}
          />
        </Col>
        <Col span={6}>
          <Button onClick={handleAddTodo} style={{ width: "100%", padding: "8px" }}>
            Add
          </Button>
        </Col>
      </Row>
      <List
        style={{ width: "450px" }} 
        header={<div>Todo List</div>}
        bordered
        dataSource={todoList}
        renderItem={(item) => (
          <List.Item
            actions={[
              editingId === item.id ? (
                <>
                  <Button type="primary" onClick={() => handleUpdateTodo(item.id)}>
                    Save
                  </Button>
                  <Button onClick={() => setEditingId(null)} style={{ backgroundColor: "gray", borderColor: "gray", color: "white" }}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="primary"
                    style={{ backgroundColor: "red", borderColor: "red", color: "white" }}
                    onClick={() => handleDeleteTodo(item.id)}
                  >
                    Delete
                  </Button>
                  <Button onClick={() => startEditing(item)}>Edit</Button>
                </>
              ),
            ]}
          >
            {editingId === item.id ? (
              <Input
                value={editInputFields[item.id] || ""}
                onChange={(e) => setEditInputFields({ ...editInputFields, [item.id]: e.target.value })}
                style={{ width: "80%" }}
              />
            ) : (
              <span>{item.task}</span>
            )}
          </List.Item>
        )}
      />
      {todoList.length === 0 && <p>No todos available</p>}
    </div>
  );
}

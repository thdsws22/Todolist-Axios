import axios from "../../config/axios"; // Adjusted path

// Function to fetch todos from the backend
export const fetchTodos = async () => {
    try {
      const response = await axios.get("/todo-list"); // Note the leading slash
      console.log("Fetched todos:", response.data); // Log the fetched data
      return response.data;
    } catch (error) {
      console.error("Error fetching todos:", error); // Log any errors
      throw error; // Rethrow the error for further handling
    }
  };

// Function to add a new todo item
export const addTodo = async (task) => {
  const response = await axios.post("/todo-list", { task });
  return response.data; // Return the created todo
};

// Function to delete a todo item
export const deleteTodo = async (id) => {
  await axios.delete(`/todo-list/${id}`); // Note the use of id in the URL
};

// Function to update a todo item
export const updateTodo = async (id, task) => {
  const response = await axios.put(`/todo-list/${id}`, { task });
  return response.data; // Return the updated todo
};

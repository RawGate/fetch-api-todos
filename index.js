document.addEventListener('DOMContentLoaded', function() {
    const todoColumn = document.getElementById('todo-column');
    const addButton = document.getElementById('add-button');
    const todoInput = document.getElementById('todo-input');
    const clock = document.getElementById('clock');
  
    // Fetch todos
  
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(todos => {
        const chunkedTodos = chunkArray(todos.slice(0, 60), 1); // Chunk the todos into groups of three
        chunkedTodos.forEach(chunk => {
          const todoBox = document.createElement('div');
          todoBox.classList.add('todo-box');
          chunk.forEach(todo => {
            const todoItem = createTodoItem(todo);
            todoBox.appendChild(todoItem);
          });
          todoColumn.appendChild(todoBox);
        });
      })
      .catch(error => console.log(error));
  
  // Render a todo item
  function renderTodoItem(todo) {
    const todoBox = document.createElement('div');
    todoBox.classList.add('todo-box');
    
    const todoItem = createTodoItem(todo);
    todoBox.appendChild(todoItem);
    
    const todoColumn = document.getElementById('todo-column'); // Get the todo column element
    todoColumn.appendChild(todoBox); // Append the todo box to the todo column
  }
  function createTodoItem(todo) {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');
    
    // Check if the todo is completed
    if (todo.completed) {
      todoItem.classList.add('completed');
    }
    
    todoItem.innerHTML = `
      <input type="checkbox" class="todo-item__checkbox" ${todo.completed ? 'checked' : ''}>
      <span class="todo-item__title">${todo.title}</span>
      <div class="todo-details">
        <p>ID: ${todo.id}</p>
        <p>User ID: ${todo.userId}</p>
        <p>Completed: ${todo.completed}</p>
      </div>
      <div class="button-container">
        <button class="edit-button">&#9998;</button>
        <button class="delete-button">&#10006;</button>
      </div>
    `;
    return todoItem;
  }
  
    // Chunk an array into groups of specified size
    function chunkArray(array, size) {
      const chunkedArray = [];
      for (let i = 0; i < array.length; i += size) {
        const chunk = array.slice(i, i + size);
        chunkedArray.push(chunk);
      }
      return chunkedArray;
    }
  
    // Add event listener to the add button
    addButton.addEventListener('click', function() {
      const task = todoInput.value.trim();
  
      if (task) {
        const todo = {
          id: Date.now(),
          title: task
        };
        renderTodoItem(todo);
        todoInput.value = '';
      }
    });
  
    // Update the clock every second
    setInterval(function() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      clock.textContent = `${hours}:${minutes}:${seconds}`;
    }, 1000);
  
    // Add event listeners to the delete buttons
    document.addEventListener('click', function(event) {
      if (event.target.classList.contains('delete-button')) {
        const todoBox = event.target.closest('.todo-box');
        todoBox.remove();
      }
    });
  
    // Add event listeners to the edit buttons
    document.addEventListener('click', function(event) {
      if (event.target.classList.contains('edit-button')) {
        const todoItem = event.target.closest('.todo-item');
        const todoTitle = todoItem.querySelector('.todo-item__title');
        todoTitle.contentEditable = true;
        todoTitle.focus();
        event.target.textContent = 'Save';
        event.target.classList.add('save-button');
        event.target.classList.remove('edit-button');
      } else if (event.target.classList.contains('save-button')) {
        const todoItem = event.target.closest('.todo-item');
        const todoTitle = todoItem.querySelector('.todo-item__title');
        todoTitle.contentEditable = false;
        event.target.textContent = 'Edit';
        event.target.classList.add('edit-button');
        event.target.classList.remove('save-button');
      }
    });
  });

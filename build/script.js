document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');

    // Array to store todo items. Each item is an object.
    // Structure: { id: string, text: string, completed: boolean, dueDate: string, dueTime: string }
    let todos = [];

    // Function to render all todo items to the DOM
    function renderTodos() {
        // Clear existing list items
        todoList.innerHTML = '';

        // Iterate over the todos array and create HTML for each item
        todos.forEach(todo => {
            const listItem = document.createElement('li');
            listItem.classList.add('todo-item');
            // Add 'completed' class if the todo is marked as completed
            if (todo.completed) {
                listItem.classList.add('completed');
            }
            // Store the todo's ID on the list item for easy access
            listItem.dataset.id = todo.id;

            // Display task text and due date/time
            const todoContent = `
                <div class="todo-content">
                    <span class="task-text">${todo.text}</span>
                    <span class="task-datetime">
                        ${todo.dueDate ? `Due: ${todo.dueDate}` : ''}
                        ${todo.dueTime ? ` at ${todo.dueTime}` : ''}
                        ${!todo.dueDate && !todo.dueTime ? 'No due date/time' : ''}
                    </span>
                </div>
            `;

            // Action buttons for each task
            const todoActions = `
                <div class="todo-actions">
                    <button class="complete-btn">${todo.completed ? 'Unmark' : 'Complete'}</button>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            listItem.innerHTML = todoContent + todoActions;
            todoList.appendChild(listItem);
        });
    }

    // Function to add a new todo item
    function addTodo() {
        const taskText = todoInput.value.trim(); // Get text and remove whitespace

        if (taskText === '') {
            // Show a simple message if input is empty (instead of alert)
            alert('Please enter a task!');
            return;
        }

        // Create a new todo object with a unique ID
        const newTodo = {
            id: crypto.randomUUID(), // Generate a unique ID for the task
            text: taskText,
            completed: false,
            dueDate: '', // Initialize without date
            dueTime: ''  // Initialize without time
        };

        todos.push(newTodo); // Add the new todo to the array
        todoInput.value = ''; // Clear the input field
        renderTodos(); // Re-render the list to show the new todo
    }

    // Function to handle clicks on todo items (complete, edit, delete)
    function handleTodoClick(event) {
        const target = event.target; // The element that was clicked
        const listItem = target.closest('.todo-item'); // Find the parent list item
        if (!listItem) return; // If clicked outside a todo item, do nothing

        const todoId = listItem.dataset.id; // Get the ID of the clicked todo

        if (target.classList.contains('complete-btn')) {
            // Toggle completion status
            const todoIndex = todos.findIndex(todo => todo.id === todoId);
            if (todoIndex > -1) {
                todos[todoIndex].completed = !todos[todoIndex].completed;
                renderTodos(); // Re-render to update the UI
            }
        } else if (target.classList.contains('delete-btn')) {
            // Delete the todo item
            todos = todos.filter(todo => todo.id !== todoId);
            renderTodos(); // Re-render to update the UI
        } else if (target.classList.contains('edit-btn')) {
            // Open edit form for the todo item
            openEditForm(todoId);
        }
    }

    // Function to open the edit form for a specific todo
    function openEditForm(id) {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        const listItem = document.querySelector(`.todo-item[data-id="${id}"]`);
        if (!listItem) return;

        // Add 'edit-mode' class to hide original content and show edit form
        listItem.classList.add('edit-mode');

        // Create the edit form elements
        const editForm = document.createElement('div');
        editForm.classList.add('edit-form');
        editForm.innerHTML = `
            <input type="text" class="edit-text-input" value="${todo.text}">
            <input type="date" class="edit-date-input" value="${todo.dueDate}">
            <input type="time" class="edit-time-input" value="${todo.dueTime}">
            <div style="display: flex; gap: 8px; justify-content: flex-end;">
                <button class="save-btn">Save</button>
                <button class="cancel-btn">Cancel</button>
            </div>
        `;

        // Append the edit form to the list item
        listItem.appendChild(editForm);

        // Focus on the text input
        editForm.querySelector('.edit-text-input').focus();

        // Add event listeners for save and cancel buttons within the edit form
        editForm.querySelector('.save-btn').addEventListener('click', () => {
            const newText = editForm.querySelector('.edit-text-input').value.trim();
            const newDate = editForm.querySelector('.edit-date-input').value;
            const newTime = editForm.querySelector('.edit-time-input').value;

            // Update the todo object
            todo.text = newText;
            todo.dueDate = newDate;
            todo.dueTime = newTime;

            // Remove edit mode and re-render
            listItem.classList.remove('edit-mode');
            listItem.removeChild(editForm);
            renderTodos();
        });

        editForm.querySelector('.cancel-btn').addEventListener('click', () => {
            // Simply remove edit mode and re-render to revert changes
            listItem.classList.remove('edit-mode');
            listItem.removeChild(editForm);
            renderTodos();
        });
    }

    // Event Listeners
    addTodoBtn.addEventListener('click', addTodo); // Add task on button click
    todoInput.addEventListener('keypress', (event) => {
        // Add task on Enter key press in the input field
        if (event.key === 'Enter') {
            addTodo();
        }
    });
    todoList.addEventListener('click', handleTodoClick); // Handle clicks within the todo list

    // Initial render of todos (useful if you were loading from storage)
    renderTodos();
});

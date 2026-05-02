const content = document.getElementById('content');
const navButtons = document.querySelectorAll('.nav-button');
const templates = {
  home: document.getElementById('home-template'),
  todos: document.getElementById('todos-template'),
  create: document.getElementById('create-template'),
};

function setActiveNav(page) {
  navButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.page === page);
  });
}

function render(page) {
  setActiveNav(page);
  content.innerHTML = '';
  const clone = templates[page].content.cloneNode(true);
  content.appendChild(clone);

  if (page === 'home') {
    registerHomeEvents();
  }
  if (page === 'todos') {
    registerTodoEvents();
  }
  if (page === 'create') {
    registerCreateEvents();
  }
}

function registerHomeEvents() {
  const quoteButton = document.getElementById('load-quote');
  const quoteOutput = document.getElementById('quote-output');

  quoteButton.addEventListener('click', async () => {
    quoteOutput.textContent = 'Loading quote...';
    try {
      const response = await fetch('https://api.quotable.io/random');
      if (!response.ok) throw new Error('Quote request failed.');
      const data = await response.json();
      quoteOutput.textContent = `"${data.content}" — ${data.author}`;
    } catch (error) {
      quoteOutput.textContent = 'Unable to load a quote right now. Please try again later.';
    }
  });
}

async function fetchTodos() {
  const list = document.getElementById('todo-list');
  const status = document.getElementById('todos-status');

  status.textContent = 'Fetching todos...';
  list.innerHTML = '';

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=8');
    if (!response.ok) throw new Error('Todo fetch failed.');
    const todos = await response.json();

    if (todos.length === 0) {
      status.textContent = 'No todos were returned by the API.';
      return;
    }

    todos.forEach(todo => {
      const listItem = document.createElement('li');
      listItem.className = todo.completed ? 'completed' : '';
      listItem.innerHTML = `
        <p class="todo-title">${todo.title}</p>
        <span class="todo-status ${todo.completed ? 'done' : 'pending'}">
          ${todo.completed ? 'Done' : 'Pending'}
        </span>
      `;
      list.appendChild(listItem);
    });

    status.textContent = `Loaded ${todos.length} todos from the API.`;
  } catch (error) {
    status.textContent = 'Unable to load todos. Check your connection and try again.';
  }
}

function registerTodoEvents() {
  document.getElementById('fetch-todos').addEventListener('click', fetchTodos);
  document.getElementById('clear-todos').addEventListener('click', () => {
    document.getElementById('todo-list').innerHTML = '';
    document.getElementById('todos-status').textContent = 'Todo list cleared.';
  });
}

function registerCreateEvents() {
  const form = document.getElementById('create-form');
  const responseCard = document.getElementById('create-response');

  form.addEventListener('submit', async event => {
    event.preventDefault();
    responseCard.textContent = 'Sending post...';

    const title = document.getElementById('post-title').value.trim();
    const body = document.getElementById('post-body').value.trim();

    if (!title || !body) {
      responseCard.textContent = 'Please add both a title and a body before submitting.';
      return;
    }

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          body,
          userId: 1,
        }),
      });

      if (!response.ok) throw new Error('Post request failed.');
      const data = await response.json();
      responseCard.textContent = `Post created successfully!\nID: ${data.id}\nTitle: ${data.title}\nBody: ${data.body}`;
      form.reset();
    } catch (error) {
      responseCard.textContent = 'Failed to submit the post. Please try again later.';
    }
  });
}

navButtons.forEach(button => {
  button.addEventListener('click', () => render(button.dataset.page));
});

render('home');

let content;
let navButtons;
let templates;
const DICTIONARY_API = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

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
  if (page === 'dictionary') {
    registerDictionaryEvents();
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

function getFallbackText(value, fallback) {
  return value && value.trim().length > 0 ? value : fallback;
}

function summarizeSynonyms(meanings) {
  const synonyms = meanings.flatMap(meaning => meaning.definitions.flatMap(def => def.synonyms || []));
  return [...new Set(synonyms)].slice(0, 8);
}

function renderDictionaryResult(entry) {
  const phonetic = getFallbackText(entry.phonetics.find(item => item.text)?.text || '', 'No pronunciation available.');
  const definitions = entry.meanings.flatMap(meaning =>
    meaning.definitions.map(def => ({
      partOfSpeech: meaning.partOfSpeech,
      text: def.definition,
    }))
  );
  const synonyms = summarizeSynonyms(entry.meanings);

  return `
    <div class="definition-card">
      <h2>${entry.word}</h2>
      <p class="phonetic-line">Pronunciation: ${phonetic}</p>
      <h3>Definitions</h3>
      ${definitions.length > 0 ? `
        <ul>
          ${definitions.map(def => `<li><strong>${def.partOfSpeech}:</strong> ${def.text}</li>`).join('')}
        </ul>
      ` : '<p>No definitions available for this entry.</p>'}
    </div>
    <div class="synonym-block">
      <h3>Synonyms</h3>
      <p>${synonyms.length > 0 ? synonyms.join(', ') : 'No synonyms available for this word.'}</p>
    </div>
  `;
}

async function performDictionarySearch(word) {
  const feedback = document.getElementById('dictionary-feedback');
  const results = document.getElementById('dictionary-results');

  const normalizedWord = word.trim();
  if (!normalizedWord) {
    feedback.textContent = 'Please enter a word to search.';
    results.innerHTML = '';
    return;
  }

  feedback.textContent = 'Searching...';
  results.innerHTML = '';

  try {
    const response = await fetch(`${DICTIONARY_API}${encodeURIComponent(normalizedWord.toLowerCase())}`);
    if (!response.ok) {
      const isNotFound = response.status === 404;
      feedback.textContent = isNotFound
        ? `No dictionary entries found for "${normalizedWord}".`
        : 'Unable to reach the dictionary service right now. Please try again later.';
      return;
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      feedback.textContent = `No dictionary entries found for "${normalizedWord}".`;
      return;
    }

    results.innerHTML = renderDictionaryResult(data[0]);
    feedback.textContent = `Showing results for "${normalizedWord}".`;
  } catch (error) {
    feedback.textContent = 'An error occurred while searching. Please check your connection and try again.';
  }
}

function registerDictionaryEvents() {
  const form = document.getElementById('dictionary-form');
  const input = document.getElementById('dictionary-input');

  form.addEventListener('submit', event => {
    event.preventDefault();
    performDictionarySearch(input.value);
  });
}

function initializeApp() {
  if (typeof document === 'undefined') return;

  content = document.getElementById('content');
  navButtons = document.querySelectorAll('.nav-button');
  templates = {
    home: document.getElementById('home-template'),
    todos: document.getElementById('todos-template'),
    create: document.getElementById('create-template'),
    dictionary: document.getElementById('dictionary-template'),
  };

  if (!content || !navButtons.length) return;

  navButtons.forEach(button => {
    button.addEventListener('click', () => render(button.dataset.page));
  });

  render('home');
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getFallbackText,
    summarizeSynonyms,
    renderDictionaryResult,
  };
}

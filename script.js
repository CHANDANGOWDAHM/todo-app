// Simple Todo app with localStorage persistence

const STORAGE_KEY = 'todos-v1';

let todos = [];
let filter = 'all'; // all | active | completed

// DOM
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const filters = document.querySelectorAll('.filter-btn');
const itemsLeft = document.getElementById('items-left');
const clearCompletedBtn = document.getElementById('clear-completed');

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function load() {
  try {
    todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (e) {
    todos = [];
  }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

function render() {
  // filter todos
  const visible = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  list.innerHTML = '';
  visible.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.completed ? ' completed' : '');
    li.dataset.id = todo.id;

    const checkbox = document.createElement('button');
    checkbox.className = 'checkbox' + (todo.completed ? ' checked' : '');
    checkbox.setAttribute('aria-label', todo.completed ? 'Mark as active' : 'Mark as completed');
    checkbox.innerHTML = todo.completed ? '✓' : '';
    checkbox.addEventListener('click', () => toggleComplete(todo.id));

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = todo.text;
    label.tabIndex = 0;
    label.addEventListener('dblclick', () => startEdit(todo.id, li));

    const actions = document.createElement('div');
    actions.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.title = 'Edit';
    editBtn.innerHTML = '✎';
    editBtn.addEventListener('click', () => startEdit(todo.id, li));

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.title = 'Delete';
    delBtn.innerHTML = '🗑';
    delBtn.addEventListener('click', () => removeTodo(todo.id));

    actions.append(editBtn, delBtn);
    li.append(checkbox, label, actions);
    list.appendChild(li);
  });

  const left = todos.filter(t => !t.completed).length;
  itemsLeft.textContent = `${left} item${left !== 1 ? 's' : ''} left`;
}

function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const todo = { id: uid(), text: trimmed, completed: false, createdAt: Date.now() };
  todos.unshift(todo);
  save();
  render();
}

function toggleComplete(id) {
  const t = todos.find(x => x.id === id);
  if (!t) return;
  t.completed = !t.completed;
  save();
  render();
}

function removeTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

function startEdit(id, li) {
  const t = todos.find(x => x.id === id);
  if (!t) return;
  li.innerHTML = '';

  const editInput = document.createElement('input');
  editInput.className = 'edit-input';
  editInput.value = t.text;
  editInput.setAttribute('aria-label', 'Edit todo');

  const saveBtn = document.createElement('button');
  saveBtn.className = 'add-btn';
  saveBtn.textContent = 'Save';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'icon-btn';
  cancelBtn.textContent = 'Cancel';

  li.append(editInput, saveBtn, cancelBtn);
  editInput.focus();
  editInput.select();

  function finish(newText) {
    const trimmed = newText.trim();
    if (trimmed) t.text = trimmed;
    save();
    render();
  }

  saveBtn.addEventListener('click', () => finish(editInput.value));
  cancelBtn.addEventListener('click', () => render());
  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') finish(editInput.value);
    if (e.key === 'Escape') render();
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(input.value);
  input.value = '';
});

filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    render();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.completed);
  save();
  render();
});

// Initial load
load();
render();

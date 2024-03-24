import { Todos } from './class/Todos.js';

const BACKEND_ROOT_URL = 'http://localhost:3001';
const todos = new Todos(BACKEND_ROOT_URL);

const list = document.querySelector('ul');
const input = document.querySelector('input');

input.disabled = true;

const renderTask = (task) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item');
    li.setAttribute('data-key', task.getId().toString());
    li.innerHTML = task.getText();
    renderLink(li, task.getId());
    list.appendChild(li);
}

const renderLink = (li, id) => {
    const a = li.appendChild(document.createElement('a'));
    a.innerHTML = '<i class="bi bi-trash"></i>';
    a.setAttribute('style', 'float:right');
    a.addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            await todos.removeTask(id);
            const li_to_remove = document.querySelector(`[data-key="${id}"]`);
            if (li_to_remove) {
                list.removeChild(li_to_remove);
            }
        } catch (error) {
            console.error(error);
        }
    });
}

const getTasks = () => {
    todos.getTasks().then((tasks) => {
        tasks.forEach(task => {
            renderTask(task);
        });
        input.disabled = false;
    }).catch((error) => {
        alert(error);
    });
}

const saveTask = async (task) => {
    try {
        const newTask = await todos.addTask(task);
        renderTask(newTask);
        input.value = '';
    } catch (error) {
        console.error(error);
    }
}

input.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const task = input.value.trim();
        if (task !== '') {
            await saveTask(task);
        }
    }
});

getTasks();
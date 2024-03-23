const BACKEND_ROOT_URL = 'http://localhost:3001';

const list = document.querySelector('ul');
const input = document.querySelector('input');

input.disabled = false;

const renderTask = (task) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item');
    li.textContent = task.description; // Assuming your task object has a 'description' property
    list.appendChild(li);
}

const getTasks = async () => {
    try {
        const response = await fetch(`${BACKEND_ROOT_URL}/`);
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        data.forEach((task) => {
            renderTask(task);
        });
    } catch (error) {
        console.error(error);
    }
}

const saveTask = async (task) => {
    try {
        const response = await fetch(`${BACKEND_ROOT_URL}/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: task })
        });
        if (!response.ok) {
            throw new Error('Failed to save task');
        }
        const data = await response.json();
        renderTask(data);
        input.value = '';
    } catch (error) {
        console.error(error);
    }
}

getTasks();

input.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const task = input.value.trim();
        if (task !== '') {
            await saveTask(task);
        }
    }
});
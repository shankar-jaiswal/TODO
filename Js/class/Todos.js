import { Task } from './Task.js';

class Todos {
    #tasks = [];
    #backend_url = '';

    constructor(url) {
        this.#backend_url = url;
    }

    getTasks = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${this.#backend_url}`);
                const tasksJson = await response.json();
                this.#readJson(tasksJson);
                resolve(this.#tasks);
            } catch (error) {
                reject(error);
            }
        });
    }

    addTask = async (text) => {
        try {
            const response = await fetch(`${this.#backend_url}/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ description: text })
            });
            const newTaskJson = await response.json();
            return this.#addToArray(newTaskJson.id, newTaskJson.description);
        } catch (error) {
            throw new Error('Failed to save task');
        }
    }

    removeTask = async (id) => {
        try {
            await fetch(`${this.#backend_url}/delete/${id}`, {
                method: 'DELETE'
            });
            this.#removeFromArray(id);
            return id;
        } catch (error) {
            throw new Error('Failed to remove task');
        }
    }

    #readJson = (tasksJson) => {
        tasksJson.forEach(node => {
            const task = new Task(node.id, node.description);
            this.#tasks.push(task);
        });
    }

    #addToArray = (id, text) => {
        const task = new Task(id, text);
        this.#tasks.push(task);
        return task;
    }

    #removeFromArray = (id) => {
        this.#tasks = this.#tasks.filter(task => task.getId() !== id);
    }
}

export { Todos };
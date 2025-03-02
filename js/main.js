new Vue({
    el: '#app',
    data: {
        showForm: false,
        showReturnForm: false,
        showModal: false,
        returnReason: '',
        editIndex: null,
        currentTask: {},
        newTask: {
            title: '',
            description: '',
            deadline: ''
        },
        tasks: [],
        inProgressTasks: [],
        testingTasks: [],
        completedTasks: []
    },
    methods: {
        openForm() {
            this.showForm = true;
        },
        closeForm() {
            this.showForm = false;
            this.newTask = { title: '', description: '', deadline: '' };
        },
        addTask() {
            const newTask = {
                title: this.newTask.title,
                description: this.newTask.description,
                deadline: this.newTask.deadline,
                createdAt: new Date().toLocaleString(),
                lastEditedAt: null,
                status: 'Запланировано'
            };
            this.tasks.push(newTask);
            this.closeForm();
        },
        deleteTask(index, arrayName) {
            this[arrayName].splice(index, 1);
        },
        moveToInProgress(index) {
            const task = this.tasks[index];
            if (task) {
                task.status = 'В работе';
                this.inProgressTasks.push(task);
                this.tasks.splice(index, 1);
            }
        },
        startEdit(index, arrayName) {
            this.editIndex = index;
            this.currentTask = { ...this[arrayName][index] };
            this.showModal = true;
        },
        saveEdit() {
            if (this.editIndex !== null) {
                const taskArray = this.getTaskArray();
                if (taskArray) {
                    taskArray[this.editIndex] = { ...this.currentTask, lastEditedAt: new Date().toLocaleString() };
                }
            }
            this.showModal = false;
        },
        cancelEdit() {
            this.showModal = false;
        },
        openReturnForm(index) {
            this.returnIndex = index;
            this.showReturnForm = true;
        },
        closeReturnForm() {
            this.showReturnForm = false;
            this.returnReason = '';
        },
        returnTaskToInProgress() {
            const task = this.testingTasks[this.returnIndex];
            if (task) {
                task.returnReason = this.returnReason;
                task.status = 'Возвращено в работу';
                task.lastEditedAt = new Date().toLocaleString();
                this.inProgressTasks.push(task);
                this.testingTasks.splice(this.returnIndex, 1);
            }
            this.closeReturnForm();
        },
        moveToTesting(index) {
            const task = this.inProgressTasks[index];
            if (task) {
                task.status = 'Тестирование';
                this.testingTasks.push(task);
                this.inProgressTasks.splice(index, 1);
            }
        },
        moveToCompleted(index) {
            const task = this.testingTasks[index];
            if (task) {
                const deadlineDate = new Date(task.deadline);
                const currentDate = new Date();
                if (currentDate > deadlineDate) {
                    task.status = 'Просрочено';
                } else {
                    task.status = 'Выполнено';
                }
                task.lastEditedAt = new Date().toLocaleString();
                this.completedTasks.push(task);
                this.testingTasks.splice(index, 1);
            }
        },
        getTaskClass(task) {
            const deadlineDate = new Date(task.deadline);
            const currentDate = new Date();
            const diffTime = deadlineDate - currentDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays < 0) {
                return 'overdue';
            } else if (diffDays <= 2) {
                return 'urgent';
            }
            return '';
        },
        getTaskArray() {
            if (this.editIndex !== null) {
                if (this.inProgressTasks[this.editIndex]) {
                    return this.inProgressTasks;
                } else if (this.testingTasks[this.editIndex]) {
                    return this.testingTasks;
                } else {
                    return this.tasks;
                }
            }
            return null;
        }
    }
});
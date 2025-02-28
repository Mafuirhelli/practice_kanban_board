new Vue({
    el: '#app',
    data: {
        showForm: false,
        newTask: {
            title: '',
            description: '',
            deadline: ''
        },
        tasks: [],
        inProgressTasks: [],
        testingTasks: [],
        completedTasks: [],
        isEditing: false,
        editIndex: null,
    },
    methods: {
        openForm() {
            this.showForm = true;
            this.newTask = { title: '', description: '', deadline: '' };
            this.isEditing =  false;
        },
        closeForm() {
            this.showForm = false;
            this.newTask = { title: '', description: '', deadline: '' };
            this.isEditing =  false;
        },
        addTask() {
            if (this.isEditing) {
                // Если режим редактирования
                const editedTask = {
                    title: this.newTask.title,
                    description: this.newTask.description,
                    deadline: this.newTask.deadline,
                    createdAt: this.tasks[this.editIndex].createdAt // Сохраняем старую дату создания
                };
                this.tasks.splice(this.editIndex, 1, editedTask); // Обновляем задачу
                this.closeForm();
            } else {
                // Если новая задача
                const task = {
                    title: this.newTask.title,
                    description: this.newTask.description,
                    deadline: this.newTask.deadline,
                    createdAt: new Date().toLocaleDateString()
                };
                this.tasks.push(task); // Добавляем задачу в первый столбец
                this.closeForm();
            }
        },
        editTask(index) {
            this.isEditing = true; // Включаем режим редактирования
            this.editIndex = index; // Сохраняем индекс задачи для редактирования
            const taskToEdit = this.tasks[index];
            this.newTask = {
                title: taskToEdit.title,
                description: taskToEdit.description,
                deadline: taskToEdit.deadline
            };
            this.openForm();
        },
        deleteTask(index) {
            this.tasks.splice(index, 1);
        },
    }
});
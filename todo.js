class TodoFactory {
    createTodo(title, priority, dueDate, alertDate = null, repeatition = null) {
        return new Todo(title, priority, dueDate, alertDate, repeatition);
    }
}

// TodoManager 클래스의 메서드를 호출하여 Todo 객체를 생성, 수정, 삭제, 검색하는 작업을 수행
// TodoManager 클래스와 협력하여 Todo 객체에 대한 작업을 실행하고, 각자의 책임과 역할을 가짐
class TodoCommand {
    constructor(todo) {
        this.todo = todo;
    }
    execute() {
        throw new Error("execute 메서드가 구현되어 있지 않습니다.");
    }
}

class AddTodoCommand extends TodoCommand {
    constructor(todo, todoManager) {
        super(todo);
        this.todoManager = todoManager;
    }
    execute() {
        // Todo를 추가하는 작업 수행
        this.todoManager.addTodo(this.todo);
        this.todoManager.printTodosList([this.todo]);
    }
}

class UpdateTodoCommand extends TodoCommand {
    constructor(oldTodo, newTodo, todoManager) {
        super(oldTodo);
        this.newTodo = newTodo;
        this.todoManager = todoManager;
    }
    execute() {
        const index = this.todoManager.searchTodoIndexByTitle(this.todo.title);
        if (index !== -1) {
            this.todoManager.updateTodo(index, this.newTodo);
            const foundTodo = this.todoManager.todoList[index];
            this.todoManager.printTodosList([foundTodo]);
            console.log(`${this.todo.title}를 ${this.newTodo.title}로 수정합니다.\n`);
        } else {
            console.log("수정할 Todo 항목이 존재하지 않습니다.\n");
        }
    }
}

 class DeleteTodoCommand extends TodoCommand {
    constructor(todo, todoManager) {
        super(todo);
        this.todoManager = todoManager;
    }
    execute() {
        const index = this.todoManager.searchTodoIndexByTitle(this.todo.title);
        if (index !== -1) {
            this.todoManager.deleteTodo(index);
            console.log(`Task ${index + 1}를 삭제합니다.\n`);
        } else {
            console.log("삭제할 Todo 항목이 존재하지 않습니다.\n");
        }
    }
}

 class SearchTodoCommand extends TodoCommand {
    constructor(title, todoManager) {
        super();
        this.title = title;
        this.todoManager = todoManager;
    }
    execute() {
        const index = this.todoManager.searchTodoIndexByTitle(this.title);
        if (index !== -1) {
            console.log(`${this.title}를 찾았습니다.\n`);
            this.todoManager.printTodosList([this.todoManager.todoList[index]]);
        } else {
            console.log(`${this.title}를 찾을 수 없습니다.\n`);
        }
    }
}

// 개별 Todo 항목을 나타내는 모델 클래스로, Todo 객체의 속성과 메서드를 정의
//  TodoManager 클래스에서 관리되는 Todo 객체의 데이터를 캡슐화하고,
// CreateCommand, UpdateCommand, DeleteCommand, SearchCommand 클래스에서 작업의 대상이 되는 객체
class Todo {
    constructor(title, priority, dueDate, alertDate, repeatition) {
        this.title = title;
        this.priority = priority;
        this.dueDate = dueDate ? new Date(dueDate) : undefined;
        if (this.dueDate) {
            this.dueDate.setHours(0, 0, 0, 0);
        }
        this.alertDate = alertDate;
        this.repeatition = repeatition;
        this.status = "진행중";
        this.observer = null;
    }

    setTitle(title) {
        this.title = title;
    }

    setPriority(priority) {
        this.priority = priority;
    }

    setDueDate(dueDate) {
        this.dueDate = dueDate;
        this.status = "완료";
        if (this.observer) {
            this.observer.update(this);
        }
    }

    setAlertDate(alertDate) {
        this.alertDate = alertDate;
    }

    setRepeatition(repeatition) {
        this.repeatition = repeatition;
    }

    setObserver(observer) {
        this.observer = observer;
    }

    setStatus() {
        this.status = "완료";
        if (this.observer) {
            this.observer.update(this);
        }
    }

    getDday() {
        if (this.dueDate) {
            const now = new Date();
            const timeDiff = this.dueDate - now;
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return daysDiff;
        }
        return null;
    }

    formatDueDate() {
        if (this.dueDate) {
            const year = this.dueDate.getFullYear();
            const month = String(this.dueDate.getMonth() + 1).padStart(2, "0");
            const date = String(this.dueDate.getDate()).padStart(2, "0");
            return `${year}-${month}-${date}`;
        }
        return "";
    }
}

// Todo 객체의 상태 변경을 감지하고 변경된 상태를 출력하는 역할을 수행
//  TodoManager 클래스와는 직접적인 관계가 없으며, Todo 객체의 상태 변경에 대한 알림을 받아 출력하는 역할을 담당
class TodoObserver {
    constructor() {
        this.completedTodoList = [];
        this.inProcessTodoList = [];
    }

    update(todo) {
        console.log("Todo 상태 업데이트: ", todo.title, " - ", todo.status);
        if (todo.status === "완료") {
            this.updateCompletedTodoList(todo);
        } else if (todo.status === "진행중") {
            this.updateInProcessTodoList(todo);
        }
    }

    updateCompletedTodoList(todo) {
        this.completedTodoList.push(todo);
        this.inProcessTodoList = this.inProcessTodoList.filter(t => t.title !== todo.title);
    }

    updateInProcessTodoList(todo) {
        this.inProcessTodoList.push(todo);
        this.completedTodoList = this.completedTodoList.filter(t => t.title !== todo.title);
    }
}

// Signleton Pattern
// Todo 객체를 관리하는 클래스로, Todo를 추가, 제거, 검색하고 모든 Todo, 완료된 Todo, 진행 중인 Todo를 출력하는 기능을 제공
//  Todo 객체의 컨테이너를 가지고 있어 Todo 객체를 관리하고, 사용자의 요청에 따라 Todo 작업을 수행
class TodoManager {
    constructor() {
        this.todoList = [];
    }

    addTodo(todo) {
        console.log("\n===== Todo 추가 =====");
        this.todoList.push(todo);
        this.checkDueDate();
    }

    deleteTodo(index) {
        console.log("\n===== Todo 삭제 =====");
        if (index !== -1) {
            this.todoList.splice(index, 1);
        }
    }

    updateTodo(index, newTodo) {
        console.log("\n===== Todo 수정 =====");
        if (index !== -1) {
            this.todoList[index] = newTodo;
            this.checkDueDate();
        }
    }

    searchTodoIndexByTitle(title) {
        return this.todoList.findIndex((todo) => {
            if (todo) { // todo 객체가 존재하는지 확인
                return todo.title === title;
            }
            return false;
        });
    }

    generateTodoID() {
        return Date.now();
    }

    printTodosList(todos) {
        todos.forEach((todo, index) => {
            console.log(index + 1, todo.title);
            console.log("\t", todo.priority);
            console.log("\t", todo.formatDueDate());
            console.log("\t", todo.alertDate);
            console.log("\t", todo.repeatition);
            const dday = todo.getDday();
            if (dday !== null) {
                console.log("\t D-day:", dday);
            }
            console.log("\n");
        });
    }

    printAllTodos() {
        console.log(`\n====== 전체 Todo 목록 ======\n`);
        this.printTodosList(this.todoList);
    }

    printCompletedTodos() {
        console.log(`\n====== 완료된 Todo 목록 ======\n`);
        const completedTodos = this.todoList.filter((todo) => todo.status === "완료");
        this.printTodosList(completedTodos);
    }

    printInProcessTodos() {
        console.log(`\n====== 진행 중인 Todo 목록 ======\n`);
        const inProcessTodos = this.todoList.filter((todo) => todo.status === "진행중");
        this.printTodosList(inProcessTodos);

    }

    checkDueDate() {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        this.todoList.forEach((todo) => {
            if (todo) { // todo 객체가 존재하는지 확인
                const todoDudDate = new Date(todo.dueDate);
                if (now.setHours(0, 0, 0, 0) > todoDudDate.setHours(0, 0, 0, 0)) {
                    todo.setDueDate();
                }
            }
        });
    }
}

export {
    TodoFactory,
    TodoCommand,
    AddTodoCommand,
    UpdateTodoCommand,
    DeleteTodoCommand,
    SearchTodoCommand,
    Todo,
    TodoObserver,
    TodoManager
};
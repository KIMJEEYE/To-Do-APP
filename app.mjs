import * as user from './user.js';
import * as todo from './todo.js';

const AddTodoCommand = todo.AddTodoCommand;
const UpdateTodoCommand = todo.UpdateTodoCommand;
const SearchTodoCommand = todo.SearchTodoCommand;
const DeleteTodoCommand = todo.DeleteTodoCommand;
const TodoFactory = todo.TodoFactory;
const TodoManager = todo.TodoManager;
const UserFactory = user.UserFactory;
const UserManager = user.UserManager;
const RegisterCommand = user.RegisterCommand;
const LoginCommand = user.LoginCommand;
const LogoutCommand = user.LogoutCommand;
const DeleteUserCommand = user.DeleteUserCommand;
const UpdateUserCommand = user.UpdateUserCommand;

class TodoApp {
  constructor() {
    this.userFactory = new UserFactory();
    this.userManager = new UserManager();
    this.todoFactory = new TodoFactory();
    this.todoManager = new TodoManager();
  }

  showFirstPage(choice, ...args) {
    console.log("===== 로그인 페이지 =====");
    console.log("1. 회원가입");
    console.log("2. 로그인");
    console.log("3. 종료");

    const choices = {
      1: this.registerUser,
      2: this.loginUser,
      3: this.exit
    };

    const selectedChoice = choices[choice];
    if (selectedChoice) {
      selectedChoice.apply(this, args);
    } else {
      console.log("잘못된 선택입니다.");
    }
  }

  showUserPage(choice, ...args) {
    console.log("===== 회원관리 페이지 =====");
    console.log("1. 로그아웃");
    console.log("2. 회원탈퇴");
    console.log("3. 회원정보 출력");
    console.log("4. 회원정보 수정");
    console.log("5. 종료");

    const choices = {
      1: this.logoutUser,
      2: this.deleteUser,
      3: this.userManager.printUserInformation.bind(this.userManager),
      4: this.updateUser,
      5: this.exit
    };

    const selectedChoice = choices[choice];
    if (selectedChoice) {
      selectedChoice.apply(this, args);
    } else {
      console.log("잘못된 선택입니다.");
    }
  }

  createUser() {
    this.admin = this.userFactory.createUser("관리자", "admin", "1234", "admin@gmail,com");
    this.user1 = this.userFactory.createUser("홍길동", "hong", "1234", "hong@gmail.com");
    this.user2 = this.userFactory.createUser("김철수", "kim", "1234", "kim@naver.com");
  }

  registerUser(user) {
    const registerCommand = new RegisterCommand(user, this.userManager);
    registerCommand.execute();
  }

  loginUser(user) {
    const loginCommand = new LoginCommand(user, this.userManager);
    loginCommand.execute();
  }

  logoutUser(user) {
    const logoutCommand = new LogoutCommand(user, this.userManager);
    logoutCommand.execute();
  }

  updateUser(user) {
    const updateUser1 = this.userFactory.createUser("홍길동", "hong", "1234", "dong@daum.net");
    const updateUser2 = this.userFactory.createUser("김철수", "kim", "4567", "kim@naver.com");

    if (user === this.user1) {
      const updateCommand = new UpdateUserCommand(this.user1, updateUser1, this.userManager);
      updateCommand.execute();
    } else if (user === this.user2) {
      const updateCommand2 = new UpdateUserCommand(this.user2, updateUser2, this.userManager);
      updateCommand2.execute();
    }
  }

  deleteUser(user) {
    const deleteCommand = new DeleteUserCommand(user, this.userManager);
    deleteCommand.execute();
  }

  showTodoMenu(choice, ...args) {
    console.log("===== Todo 메뉴 =====");
    console.log("1. Todo 추가");
    console.log("2. Todo 수정");
    console.log("3. Todo 삭제");
    console.log("4. Todo 검색");
    console.log("5. Todo 전체 목록");
    console.log("6. Todo 완료 목록");
    console.log("7. Todo 진행 목록");
    console.log("8. 로그아웃");
    console.log(`입력: ${choice}`);

    const choices = {
      '1': () => this.addTodos(...args),
      '2': () => this.updateTodo(...args),
      '3': () => this.deleteTodo(...args),
      '4': () => this.searchTodoIndexByTitle(...args),
      '5': () => this.todoManager.printAllTodos(),
      '6': () => this.todoManager.printCompletedTodos(),
      '7': () => this.todoManager.printInProcessTodos(),
      '8': () => this.logoutUser(),
    };

    const selectedChoice = choices[choice];
    if (selectedChoice) {
      selectedChoice();
    } else {
      console.log("존재하지 않는 번호입니다. 다시 시도해주세요.");
    }
  }

  createTodo() {
    this.todo1 = this.todoFactory.createTodo("Task 1", "높음", "2023-10-31", null, "매일");
    this.todo2 = this.todoFactory.createTodo("Task 2", "낮음", "2023-10-24", "2023-11-10", "매주");
    // 나머지 Todo 생성 로직
  }

  addTodos() {
    const addCommand1 = new AddTodoCommand(this.todo1, this.todoManager);
    addCommand1.execute();
    const addCommand2 = new AddTodoCommand(this.todo2, this.todoManager);
    addCommand2.execute();
  }

  updateTodo() {
    const newTodo = this.todoFactory.createTodo("Task 3", "높음", "2023-10-24", "2023-11-10", "매달");
    const updateCommand = new UpdateTodoCommand(this.todo2, newTodo, this.todoManager);
    updateCommand.execute();
  }

  searchTodoIndexByTitle() {
    const searchCommand = new SearchTodoCommand("Task 3", this.todoManager);
    searchCommand.execute();
  }

  deleteTodo() {
    const deleteCommand = new DeleteTodoCommand(this.todo1, this.todoManager);
    deleteCommand.execute();
  }

  run() {
    this.createUser();
    this.showFirstPage(1, this.user1);
    this.showFirstPage(2, this.user1);
    this.showUserPage(1, this.user1);

    this.showFirstPage(1, this.user2);
    this.showFirstPage(2, this.user2);

    if (this.userManager.currentUser) {
      this.createTodo();
      this.showTodoMenu("1");
      this.showTodoMenu("2");
      this.showTodoMenu("3");
      this.showTodoMenu("4");
      this.showTodoMenu("5");
      this.showTodoMenu("6");
      this.showTodoMenu("7");
    } else {
      console.log("로그인이 필요한 서비스입니다.");
    }

    this.showUserPage(3, this.user2);
    this.showUserPage(4, this.user2);
    this.showUserPage(2, this.user2);
  }
}

const todoApp = new TodoApp();
todoApp.run();

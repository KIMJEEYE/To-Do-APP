class UserFactory {
    createUser(userName, userID, userPassword, userEmailAddress) {
        return new User(userName, userID, userPassword, userEmailAddress);
    }
}

class User {
    constructor(userName, userID, userPassword, userEmailAddress) {
        this.userName = userName;
        this.userID = userID;
        this.userPassword = userPassword;
        this.userEmailAddress = userEmailAddress;
    }

    getUserName() {
        return this.userName;
    }

    getUserID() {
        return this.userID;
    }

    getUserPassword() {
        return this.userPassword;
    }

    getUserEmailAddress() {
        return this.userEmailAddress;
    }

    toString() {
        return `User: ${this.userName} ${this.userID} ${this.userPassword} ${this.userEmailAddress}`;
    }
}

class UserCommand {
    constructor(user, userManager) {
        this.user = user;
        this.userManager = userManager;
    }
    execute() {
        throw new Error("execute 메서드가 구현되어 있지 않습니다.");
    }
}

class RegisterCommand extends UserCommand {
    execute() {
        this.userManager.registerUser(this.user);
    }
}

class LoginCommand extends UserCommand {
    execute() {
        this.userManager.loginUser(this.user);
    }
}

class LogoutCommand extends UserCommand {
    execute() {
        this.userManager.logoutUser(this.user);
    }
}

class DeleteUserCommand extends UserCommand {
    execute() {
        this.userManager.deleteUser(this.user);
        this.userManager.printUserInformation();
    }
}

class UpdateUserCommand extends UserCommand {
    constructor(user, updateUser, userManager) {
        super(user, userManager);
        this.updateUser = updateUser;
    }
    execute() {
        this.userManager.updateUser(this.user, this.updateUser);
        this.userManager.printUserInformation(this.updateUser);
    }
}

class UserManager {
    constructor() {
        this.userList = [];
        this.admin = null;
        this.currentUser = null;
    }

    setadmin(admin) {
        this.admin = admin;
    }

    isAdmin(user) {
        return this.admin === user ? true : false;
    }

    registerUser(user) {
        console.log("===== 회원가입 =====");
        const existingUser = this.userList.find(u => u.getUserID() === user.getUserID());
        if (existingUser) {
            console.log("이미 회원이십니다 로그인해주세요.");
            return;
        }
        this.userList.push(user);
        console.log(`${user.getUserName()}님 회원가입을 축하합니다.`);
    }

    loginUser(user) {
        console.log("===== 로그인 =====");
        if (this.currentUser) {
            console.log("이미 로그인 상태입니다.");
            return;
        }
        this.userList.forEach(u => {
            if (u === user) {
                console.log(`${u.getUserName()}님 환영합니다.`);
                this.currentUser = u;
            }
        });
    }

    logoutUser(user) {
        console.log("===== 로그아웃 =====");
        if (!this.currentUser) {
            console.log("로그인 상태가 아닙니다.");
            return;
        }
        const logoutUser = this.userList.find(u => u.getUserID() === user.getUserID());
        if (logoutUser) {
            console.log(`${logoutUser.getUserName()}님 안녕히 가세요.`);
            this.currentUser = null;
        }
    }

    updateUser(oldUser, newUser) {
        console.log("===== 회원정보 수정 =====");
        const index = this.userList.findIndex(u => u === oldUser);
        if (index !== -1) {
            this.userList[index] = newUser;
            console.log(`${newUser.getUserName()}님 회원정보 수정을 축하합니다.`);
        } else {
            console.log("회원 정보를 찾을 수 없습니다.");
        }
    }

    deleteUser(user) {
        console.log("===== 회원탈퇴 =====");
        this.userList = this.userList.filter(u => u !== user);
    }

    printUserInformation(user) {
        if (this.isAdmin(user)) {
            this.userList.forEach(u => console.log(u.toString()));
        } else {
            const userInfo = this.userList.find(u => u === user);
            if (userInfo) {
                console.log(`${userInfo.toString()}`);
            } else {
                console.log("회원 정보를 찾을 수 없습니다.");
            }
        }
    }
}

export {
    UserFactory,
    User,
    UserCommand,
    RegisterCommand,
    LoginCommand,
    LogoutCommand,
    DeleteUserCommand,
    UpdateUserCommand,
    UserManager,
};

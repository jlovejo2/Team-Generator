//user can create employee
//user specifies type of employee



class Employee {
    constructor (name, id, email) {

            this.name = name;
            this.id = id;
            this.email = email;
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    getEmail() {
        return this.email;
    }

    getRole() {
        return "Employee";
    }
}

// const a = new Employee("joey");

// console.log(a.name);

module.exports = Employee;
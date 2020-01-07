const Employee = require("./employee");

class Manager extends Employee {
    constructor (name, id, email, officeNumber) {
        super (name, id, email)
        this.officeNumber = officeNumber;

    }

    getRole() {
        return this.constructor.name;
    }

    getOfficeNumber() {
        return this.officeNumber;
    }
}

module.exports = Manager;
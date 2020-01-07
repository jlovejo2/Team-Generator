const Employee = require("./employee");

class Engineer extends Employee {
    constructor(name, id , email, gitHubUsername) {
        super(name, id, email);
        this.github = gitHubUsername;

    }

    getRole() {
        return this.constructor.name;
    }
    getGithub() {
        return this.github;
    }
}

// const engineer = new Engineer ("ed", 34, "12312313@SpeechGrammarList.com", "jlovejo2" );

// engineer.printInfo();

module.exports = Engineer;
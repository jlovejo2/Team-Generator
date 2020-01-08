const Employee = require("./employee");
const Manager = require("./manager");
const Intern = require("./intern");
const Engineer = require("./engineer");
const inquirer = require("inquirer");

const questions = {
    startQuestion: "Would you like to create a team?",
    addATeamMember: "Would you like to add a team member?",
    managerName: "What is the name of your team manager?",
    officeNumber: "What is the office number of manager?",
    name: "What is this team members name?",
    role: "What type of role does this team member have?",
    ID: "What is their ID number?",
    email: "What is their email?",
    gitHub: "What is their gitHub username?",
    school: "What school do they go to?"
};

class CreateTeam {
    //use constructor to create a variable called numOfTeamMembers in CreateTeam instance and set it to 0.
    //This will be change later based on user input
    constructor() {
        this.team = [];
        this.numOfTeamMembers = 0
    };

    start() {
        this.checkForContinuation(questions.startQuestion, this.createManager, this.exitCode);
    }

    createManager() {

        return inquirer
            .prompt([

                {
                    type: 'input',
                    name: 'teamManager',
                    message: questions.managerName
                },

                {
                    type: 'input',
                    name: 'ID',
                    message: questions.ID
                },

                {
                    type: 'input',
                    name: 'email',
                    message: questions.email
                },

                {
                    type: 'input',
                    name: 'officeNumber',
                    message: questions.officeNumber
                },

            ]).then(ans => {
                const manager = new Manager(ans.teamManager, ans.ID, ans.email)
                this.team = this.team + manager;
                this.numOfTeamMembers++;
                this.checkForContinuation(questions.addATeamMember, this.addEmployee, this.exitCode)
            });
            
    };

    addEmployee() {
        return inquirer
            .prompt([

                {
                    type: 'input',
                    name: 'name',
                    message: questions.name
                },

                {
                    type: 'choice',
                    name: 'employeeRole',
                    message: questions.role,
                    choices: ["engineer", "intern"],
                },

                {
                    type: 'input',
                    name: 'ID',
                    message: questions.ID
                },

                {
                    type: 'input',
                    name: 'email',
                    message: questions.email
                },

            ]).then(emplAns => {
                if (empAns.choices == "engineer") {
                    return inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'gitHub',
                                message: questions.gitHub
                            }
                        ]).then(val => {
                            const engineer = new Engineer(emplAns.name, empAns.ID, emplAns.email, val.gitHub);
                            this.numOfTeamMembers++
                            this.checkForContinuation(questions.addATeamMember, this.addEmployee, this.exitCode)
                        });
                } else {
                    return inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'school',
                                message: questions.school
                            }
                        ]).then(val => {
                            const intern = new Intern(emplAns.name, empAns.ID, emplAns.email, val.school);
                            this.numOfTeamMembers++
                            this.checkForContinuation(questions.addATeamMember, this.addEmployee, this.exitCode)
                        });
                };
            });
    };

    printTeamInfo() {

        console.log(`Current number of members on team: ${this.numOfTeamMembers}`);
        // console.log(value);


        //log number of engineers
        //log number of interns
        //log number of managers
    };

    checkForContinuation(confirmQuestion, ifYes, ifNo) {
        return inquirer
            .prompt({
                type: "confirm",
                name: "choice",
                message: confirmQuestion,
            }).then(val => {
                if (val) {
                    ifYes()
                } else {
                    ifNo()
                }
            })
    };

    exitCode() {
        throw "See you later!"
    };
}



module.exports = CreateTeam



//_______________________________________//
//___________Saved Code___________________//
//_________________________________________//
 // type: 'input',
        // name: 'managerName',
        // message: 'What is the name of your team manager?',

        // type: 'number',
        // name: 'managerID',
        // message: 'What is the ID number of your team manager?',

        // type: 'input',
        // name: 'managerEmail',
        // message: 'What is the email of your team manager?',
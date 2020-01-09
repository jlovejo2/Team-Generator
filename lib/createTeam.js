const Manager = require("./manager");
const Intern = require("./intern");
const Engineer = require("./engineer");
const inquirer = require("inquirer");

const roles = ["engineer", "intern"];
const questions = {
    finalcheck: "What would you like to do?",
    startQuestion: "Would you like to create a team?",
    editQuestion: "What would you like to change?",
    // addATeamMember: "Would you like to add a team member?",
    // reviewTeamInfo: "Would you like to review current team info before rendering html?",
    editTeamPrompt: "Would you like to edit any team members information?",
    editChange: "Enter the correct value.",
    doneEditing: "Are you done editing team member?",
    whichTeamMember: "Which team member would you like to edit",
    managerName: "What is the name of your team manager?",
    officeNumber: "What is the office number of manager?",
    name: "What is this team members name?",
    role: "What type of role does this team member have?",
    ID: "What is their ID number?",
    email: "What is their email?",
    gitHub: "What is their gitHub username?",
    school: "What school do they go to?"
};

class CreateTeam {    //use constructor to create a variable called numOfTeamMembers in CreateTeam instance and set it to 0.
    //This will be change later based on user input
    constructor() {
        this.team = [];
        this.numOfTeamMembers = 0;
    };

    start() {
        // console.log(this);
        this.checkForContinuation(questions.startQuestion, this.createManager, this.exitCode);
    };

    checkForContinuation(confirmQuestion, ifYes, ifNo) {

        inquirer
            .prompt({
                type: "confirm",
                name: "choice",
                message: confirmQuestion,
            }).then(val => {
                console.log(val);
                if (val.choice) {
                    ifYes(this);
                } else {
                    ifNo(this);
                }
            })
    };

    createManager(that) {
        // const a = thisObj;
        // console.log(that);
        inquirer
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

                const manager = new Manager(ans.teamManager, ans.ID, ans.email, ans.officeNumber)

                that.team.push(manager);
                that.numOfTeamMembers++;
                that.finalCheck(that);
                // console.log(that);
            });

    };

    addEmployee(that) {
        inquirer
            .prompt([

                {
                    type: 'input',
                    name: 'name',
                    message: questions.name
                },

                {
                    type: 'list',
                    name: 'employeeRole',
                    message: questions.role,
                    choices: roles,
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
                if (emplAns.employeeRole == "engineer") {
                    return inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'gitHub',
                                message: questions.gitHub
                            }
                        ]).then(val => {
                            const engineer = new Engineer(emplAns.name, emplAns.ID, emplAns.email, val.gitHub);
                            that.numOfTeamMembers++
                            that.team.push(engineer);
                            // console.log(that);
                            that.finalCheck(that);
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
                            const intern = new Intern(emplAns.name, emplAns.ID, emplAns.email, val.school);
                            that.numOfTeamMembers++
                            that.team.push(intern);
                            // console.log(that);
                            that.finalCheck(that);
                        });
                };
            });
    };

    printTeamInfo(that) {
        console.log(`Current number of members on team: ${that.numOfTeamMembers}`);
        console.log(that);
        for (let i = 0; i < that.numOfTeamMembers; i++) {

            that.team[i].printInfo()
            if (that.team[i].getRole() === "Manager") {

                console.log(`Office Number: ${that.team[i].getOfficeNumber()}`);

            } else if (that.team[i].getRole() === "Engineer") {

                console.log(`GitHub Username: ${that.team[i].getGithub()}`);

            } else {
                console.log(`School: ${that.team[i].getSchool()}`);
            }
            console.log(`\n`);
        };

        this.checkForContinuation(questions.editTeamPrompt, this.editTeamPrompt, this.finalCheck)
    }

    editTeamPrompt(that) {
        const choicesTeamNames = [];
        for (let i = 0; i < that.numOfTeamMembers; i++) {
            choicesTeamNames.push(that.team[i].getName());
        }
        return inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'teamMemberToEdit',
                    message: questions.whichTeamMember,
                    choices: choicesTeamNames,
                },
            ]).then(val => {
                const memberName = val.teamMemberToEdit
                // console.log(that.team);
                const memberToEdit = that.team.filter(index => { 
                    return index.getName() === memberName
                })

                that.editTeamMember(memberToEdit);
            });
    }

    editTeamMember(wrongTeamMember) {
       
        const operations = [
            "name",
            "ID",
            "email",
        ]
        if(wrongTeamMember[0].getRole() === "Engineer") {
            operations.push("github")
        } else if (wrongTeamMember[0].getRole() === "Intern") {
            operations.push("school") 
        } else {
            operations.push("office number")
        }
     
        return inquirer
        .prompt([
            
            {
                type: 'list',
                name: 'operation',
                message: questions.editQuestion,
                choices: operations,
            },
            {
                type: 'input',
                name: 'newValue',
                message: questions.editChange,
            },

        ]).then(val => {
            if (val.operation === "name") {
                wrongTeamMember[0].name = val.newValue;
            } else if (val.operation === "ID") {
                wrongTeamMember[0].id = val.newValue;
            } else if (val.operation === "email") {
                wrongTeamMember[0].email = val.newValue
            } else if (val.operation === "github") {
                wrongTeamMember[0].github = val.newValue
            } else if (val.operation === "school") {
                wrongTeamMember[0].school = val.newValue
            } else {
                wrongTeamMember[0].officeNumber = val.newValue
            }

            this.checkForContinuation(questions.doneEditing, this.finalCheck, this.editTeamPrompt);
        });

        
    }

    finalCheck(that) {
        return inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'operation',
                    message: questions.finalcheck,
                    choices: ["Review Current Team", "Proceed to html render", "Add Team Member", "Edit Team Member", "Delete Team Member"],
                },
            ]).then(val => {
                if (val.operation === "Review Current Team") {
                    that.printTeamInfo(that)
                } else if (val.operation === "Proceed to html render") {
                    that.renderHTML()
                } else if (val.operation === "Edit Team Member") {
                    that.editTeamPrompt(that)
                } else if (val.operation === "Delete Team Member") {
                    that.deleteTeamMember()
                } else {
                    that.addEmployee(that)
                }
            })

    }

    deleteTeamMember() {

    }

    exitCode(that) {
        throw "See you later!"
    };

    renderHTML() {
        return
    }
}



module.exports = CreateTeam



//_______________________________________//
//___________Saved Code___________________//
//_________________________________________//

//look into recursion for simplicity of coding

//look into using while function 


 // type: 'input',
        // name: 'managerName',
        // message: 'What is the name of your team manager?',

        // type: 'number',
        // name: 'managerID',
        // message: 'What is the ID number of your team manager?',

        // type: 'input',
        // name: 'managerEmail',
        // message: 'What is the email of your team manager?',
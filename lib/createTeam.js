const Manager = require("./manager");
const Intern = require("./intern");
const Engineer = require("./engineer");
const inquirer = require("inquirer");

const questions = {
    finalcheck: "What would you like to do?",
    startQuestion: "Would you like to create a team?",
    addATeamMember: "Would you like to add a team member?",
    reviewTeamInfo: "Would you like to review current team info before rendering html?",
    editTeamPrompt: "Would you like to edit any team members information?",
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

    reviewTeam(that) {
        that.checkForContinuation(questions.reviewTeamInfo, that.printTeamInfo, that.exitCode)
    }

    printTeamInfo(that) {
        console.log(`Current number of members on team: ${that.numOfTeamMembers}`);

        for (let i = 0; i < that.team.length; i++) {

            if (that.team[i].getRole() === "Manager") {
                console.log(
                    `Role: ${JSON.stringify(that.team[i].getRole())}
                    Name: ${JSON.stringify(that.team[i].name)}
                    Id:   ${JSON.stringify(that.team[i].id)}
                    Email: ${JSON.stringify(that.team[i].email)}
                    Office Number: ${that.team[i].officeNumber}`
                )
            } else if (that.team[i].getRole() === "Engineer") {
                console.log(
                    `Role: ${JSON.stringify(that.team[i].getRole())}
                    Name: ${JSON.stringify(that.team[i].name)}
                    Id:   ${JSON.stringify(that.team[i].id)}
                    Email: ${JSON.stringify(that.team[i].email)}
                    GitHub Username: ${that.team[i].github}`
                )
            } else {
                console.log(
                    `Role: ${JSON.stringify(that.team[i].getRole())}
                    Name: ${JSON.stringify(that.team[i].name)}
                    Id:   ${JSON.stringify(that.team[i].id)}
                    Email: ${JSON.stringify(that.team[i].email)}
                    School: ${that.team[i].school}`
                )
            }
        };

        this.checkForContinuation(questions.editTeamPrompt, this.finalcheck, this.finalCheck)
    }

    // editTeam(that) {
    //     const choicesTeamNames = [];
    //     for (let i = 0; i < that.numOfTeamMembers; i++) {
    //         choicesTeamNames.push(that.team[i].name);
    //     }
    //     return inquirer
    //         .prompt([
    //             {
    //                 type: 'list',
    //                 name: 'teamMemberToEdit',
    //                 message: questions.whichTeamMember,
    //                 choices: choicesTeamNames,
    //             },
    //         ]).then(val => {
    //             if (val.teamMemberToEdit == "") {
    //                 return inquirer
    //                     .prompt([
    //                         {
    //                             type: 'list',
    //                             name: 'teamMemberToEdit',
    //                             message: questions.whichTeamMember,
    //                             choices: choicesTeamNames,
    //                         },
    //                     ]).then(val => {

    //                     })
    //             }
    //         }
    //     }

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
                    that.editTeamPrompt()
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
        throw "Working on it"
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
const fs = require("fs");
const Manager = require("./manager");
const Intern = require("./intern");
const Engineer = require("./engineer");
const inquirer = require("inquirer");

const roles = ["engineer", "intern"];
const questions = {

    finalcheck: "What would you like to do?",
    startQuestion: "Would you like to create a team?",
    editQuestion: "What would you like to change?",
    editTeamPrompt: "Would you like to edit any team members information?",
    editChange: "Enter the correct value.",
    deletion: "Select temember to be deleted.",
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

class CreateTeam {

    constructor() {
        this.team = [];
        this.numOfTeamMembers = 0;

    };

    start() {

        this.checkForContinuation(questions.startQuestion, this.createManager, this.exitCode);
    };

    checkForContinuation(confirmQuestion, ifYes, ifNo) {

        inquirer
            .prompt({
                type: "confirm",
                name: "choice",
                message: confirmQuestion,
            }).then(val => {

                if (val.choice) {
                    ifYes(this);
                } else {
                    ifNo(this);
                }
            })
    };

    createManager(that) {

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
                            that.finalCheck(that);
                        });
                };
            });
    };

    printTeamInfo(that) {
        console.log(`Current number of members on team: ${that.numOfTeamMembers}`);
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
        if (wrongTeamMember[0].getRole() === "Engineer") {
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
                    that.renderHTML(that)
                } else if (val.operation === "Edit Team Member") {
                    that.editTeamPrompt(that)
                } else if (val.operation === "Delete Team Member") {
                    that.deleteTeamMember(that)
                } else {
                    that.addEmployee(that)
                }
            })

    }

    deleteTeamMember(that) {
        const choicesTeamNames = [];
        for (let i = 0; i < that.numOfTeamMembers; i++) {
            choicesTeamNames.push(that.team[i].getName());
        }
        return inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'teamMemberToDelete',
                    message: questions.deletion,
                    choices: choicesTeamNames,
                },
            ]).then(val => {
                const memberName = val.teamMemberToDelete
                that.team = that.team.filter(index => {
                    return index.getName() !== memberName
                })

                that.finalCheck();
            });
    }

    exitCode(that) {
        throw "See you later!"
    };

    renderHTML(that) {
        // console.log(that.numOfTeamMembers);
        // console.log(that.team);

       console.log(that.team.map(function (index) {
            if (index.getRole() === "Manager") {
                 fs.readFile('./templates/manager.html', function(err, data1) {
                    if (err) {
                        throw err;
                    }
                        // console.log(data1.toString());
                        let managerHtml = data1.toString()
                        managerHtml = managerHtml.replace("((((Name))))", index.getName());
                        //console.log(managerHtml);
                        managerHtml = managerHtml.replace("((((Role))))", index.getRole());
                        //console.log(managerHtml);
                        managerHtml = managerHtml.replace("((((ID))))", index.getId());                       
                        managerHtml = managerHtml.replace("((((Email))))", index.getEmail());
                        managerHtml = managerHtml.replace("((((Office Number))))", index.getOfficeNumber());
                        // console.log(managerHtml);
                        return managerHtml;
                        // htmlToAdd = htmlToAdd + managerHtml;
                })
            } else if (index.getRole() === "Engineer") {
                // console.log("engineer")
                fs.readFile('./templates/engineer.html', function(err, data2) {
                    if (err) {
                        throw err;
                    }
                        // console.log(data2);
                        let engineerHtml = data2.toString()
                        engineerHtml = engineerHtml.replace("((((Name))))", index.getName());
                        engineerHtml = engineerHtml.replace("((((Role))))", index.getRole());
                        engineerHtml = engineerHtml.replace("((((ID))))", index.getId());
                        engineerHtml = engineerHtml.replace("((((Email))))", index.getEmail());
                       return engineerHtml = engineerHtml.replace("((((Github Username))))", index.getGithub());
                        // htmlToAdd = htmlToAdd + engineerHtml;
                        // // console.log(htmlToAdd);
                        // return htmlToAdd
                })
            } else {
                // console.log("intern")
                fs.readFile('./templates/intern.html', function(err, data3) {
                    if (err) {
                        throw err;
                    }
                        // console.log(data3);
                        let internHtml = data3.toString()
                        internHtml = internHtml.replace("((((Name))))", index.getName());
                        internHtml = internHtml.replace("((((Role))))", index.getRole());
                        internHtml = internHtml.replace("((((ID))))", index.getId());
                        internHtml = internHtml.replace("((((Email))))", index.getEmail());
                       return internHtml = internHtml.replace("((((School))))", index.getSchool());
                        // htmlToAdd = htmlToAdd + internHtml;
                    //     // console.log(htmlToAdd);
                    // // console.log(htmlToAdd);
                    // return htmlToAdd
                })
            };

        }));
    }
}

module.exports = CreateTeam

//_______________________________________//
//___________Saved Code___________________//
//_________________________________________//
  // for (let i = 0; i < that.numOfTeamMembers; i++) {
        //     if (that.team[i].getRole() === "Manager") {
        //         console.log("manager");
        //         fs.readFile('./templates/manager.html', function read(err, data1) {
        //             if (err) {
        //                 throw err;
        //             } else {

        //                 let managerHtml = data1.toString()
        //                 managerHtml = managerHtml.replace("((((Name))))", that.team[i].getName());
        //                 managerHtml = managerHtml.replace("((((Role))))", that.team[i].getRole());
        //                 managerHtml = managerHtml.replace("((((ID))))", that.team[i].getId());
        //                 managerHtml = managerHtml.replace("((((Email))))", that.team[i].getEmail());
        //                 managerHtml = managerHtml.replace("((((Office Number))))", that.team[i].getOfficeNumber());
        //                 htmlToAdd = htmlToAdd + managerHtml;
        //                 console.log(htmlToAdd);
        //             }
        //         })
        //     } else if (that.team[i].getRole() === "Engineer") {
        //         console.log("engineer")
        //         fs.readFile('./templates/engineer.html', function read(err, data2) {
        //             if (err) {
        //                 throw err;
        //             } else {

        //                 let engineerHtml = data2.toString()
        //                 engineerHtml = engineerHtml.replace("((((Name))))", that.team[i].getName());
        //                 engineerHtml = engineerHtml.replace("((((Role))))", that.team[i].getRole());
        //                 engineerHtml = engineerHtml.replace("((((ID))))", that.team[i].getId());
        //                 engineerHtml = engineerHtml.replace("((((Email))))", that.team[i].getEmail());
        //                 engineerHtml = engineerHtml.replace("((((Github Username))))", that.team[i].getGithub());
        //                 htmlToAdd = htmlToAdd + engineerHtml;
        //                 console.log(htmlToAdd);
        //             }
        //         })
        //     } else {
        //         console.log("intern")
        //         fs.readFile('./templates/intern.html', function read(err, data3) {
        //             if (err) {
        //                 throw err;
        //             } else {

        //                 let internHtml = data3.toString()
        //                 internHtml = internHtml.replace("((((Name))))", that.team[0].getName());
        //                 internHtml = internHtml.replace("((((Role))))", that.team[0].getRole());
        //                 internHtml = internHtml.replace("((((ID))))", that.team[0].getId());
        //                 internHtml = internHtml.replace("((((Email))))", that.team[0].getEmail());
        //                 internHtml = internHtml.replace("((((School))))", that.team[0].getSchool());
        //                 htmlToAdd = htmlToAdd + internHtml;
        //                 console.log(htmlToAdd);
        //             }
        //         })

        //     }

        // };

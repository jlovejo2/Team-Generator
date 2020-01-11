const fs = require("fs");
const Manager = require("./manager");
const Intern = require("./intern");
const Engineer = require("./engineer");
const inquirer = require("inquirer");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);

const roles = ["manager","engineer", "intern"];
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
        this.htmlArr = [];
        this.files = ["./templates/manager.html", "./templates/engineer.html", "./templates/intern.html", "./templates/main.html"]

    };

    delayExecute(functionToRun) {
        return setTimeout(functionToRun, 1000)
    }

    start() {

        async function createHtmlArr(files, htmlArr) {
            try {

                for (let file of files) {
                    const fileStr = await readFileAsync(file, "utf8")

                    htmlArr.push(fileStr.toString());
                }

                console.log("Welcome to Team Generator")

                return htmlArr


            } catch (err) {
                console.log("Error reading html templates");
            }
        }

        this.htmlArr = createHtmlArr(this.files, this.htmlArr);
        console.log(this.htmlArr)

        this.start2();
    }

    start2() {

        this.checkForContinuation(questions.startQuestion, this.createManager, this.exitCode)
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
                    choices: [roles[1],roles[2]]
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
        console.log(`\n`);
        for (let i = 0; i < that.numOfTeamMembers; i++) {
            
            if (that.team[i] == "undefined") {
                console.log("Member deleted");
                delete team[i]
            } else if (that.team[i].getRole() === "Manager") {
                that.team[i].printInfo()
                console.log(`Office Number: ${that.team[i].getOfficeNumber()}`);

            } else if (that.team[i].getRole() === "Engineer") {
                that.team[i].printInfo()
                console.log(`GitHub Username: ${that.team[i].getGithub()}`);

            } else {
                that.team[i].printInfo()
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
                console.log(that.team);
                that.finalCheck(that);
            });
    }

    exitCode(that) {
        throw "See you later!"
    };

    renderHTML(that) {

        this.htmlArr.then((val) => {

            let teamHtml = "";
            let noCommas = "";
            const mapArr = that.team.map(function (index) {

                let htmlNew = "";

                if (index.getRole() === "Manager") {
                    htmlNew = val[0].replace("((((Name))))", index.getName());
                    htmlNew = htmlNew.replace("((((Role))))", index.getRole());
                    htmlNew = htmlNew.replace("((((ID))))", index.getId());
                    htmlNew = htmlNew.replace("((((Email))))", index.getEmail());
                    htmlNew = htmlNew.replace("((((Office Number))))", index.getOfficeNumber());
                    
                } else if (index.getRole() === "Engineer") {
                    // console.log("engineer")

                    htmlNew = val[1].replace("((((Name))))", index.getName());
                    htmlNew = htmlNew.replace("((((Role))))", index.getRole());
                    htmlNew = htmlNew.replace("((((ID))))", index.getId());
                    htmlNew = htmlNew.replace("((((Email))))", index.getEmail());
                    htmlNew = htmlNew.replace("((((Github Username))))", index.getGithub());
                   
                    htmlNew = htmlNew.replace(",", "");  
                   
                } else {

                    // console.log("intern")

                    htmlNew = val[2].replace("((((Name))))", index.getName());
                    htmlNew = htmlNew.replace("((((Role))))", index.getRole());
                    htmlNew = htmlNew.replace("((((ID))))", index.getId());
                    htmlNew = htmlNew.replace("((((Email))))", index.getEmail());
                    htmlNew = htmlNew.replace("((((School))))", index.getSchool());
                    
                }

                return htmlNew

            });

           noCommas = mapArr.join().replace(/,/g, " ");

            teamHtml = val[3].replace("((((Team Members Go Here))))", noCommas );
            fs.writeFile("index.html", teamHtml, function (err) {
                if (err) {
                    console.log(err);
                }
                console.log("Your Html has been created!")
            })
        });
    }
}

module.exports = CreateTeam

//_______________________________________//
//___________Saved Code___________________//
//_________________________________________//

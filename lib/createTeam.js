const fs = require("fs");
const Manager = require("./manager");
const Intern = require("./intern");
const Engineer = require("./engineer");
const inquirer = require("inquirer");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);

//This is an array of roles that is used in inquirer prompts
const roles = ["manager", "engineer", "intern"];
//This is an array of questions that are used the inquirer prompts.  The goal of doing this was to make it easier to edit questions
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

//creates the calls CreateTeam that is called in the index.js file
class CreateTeam {
    //This is the constructor 
    constructor() {
        this.team = [];
        this.numOfTeamMembers = 0;
        this.htmlArr = [];
        this.files = ["./templates/manager.html", "./templates/engineer.html", "./templates/intern.html", "./templates/main.html"]

    };

    //This function starts the code in the command prompt
    start() {

        //this line of code delcares an ansync function.  The purpose of this function is to take the files in my files array declared in the CreateTeam class and read them
        //The parameters passed into it is the array of files and the object the files that are read by readFileAsync will be pushed into.
        async function createHtmlArr(files, returnStr) {
            //try is used in pairing with catch to catch any errs that are run within the code.
            try {
                //run a for loop for every file in the files array
                for (let file of files) {

                    //create a variable that is equal to the string returned from performing a readFileAsync on the specified index of the file.  
                    //The await is telling the code to await completion of this function before continuing
                    const fileStr = await readFileAsync(file, "utf8")

                    //take the string that returned from reading the file and push it into htmlArr
                    returnStr.push(fileStr.toString());
                }
                console.log("Welcome to Team Generator")
                return returnStr
            } catch (err) {
                console.log("Error reading html templates");
            }
        }

        //this is where the async function is actually called.  The returned string is set equal to this.htmlArr
        this.htmlArr = createHtmlArr(this.files, this.htmlArr);

        //this calls the start2() method to continue running the function
        this.start2();
    }

    start2() {
        //runs the checkForContinutation function with the deliver parameters
        this.checkForContinuation(questions.startQuestion, this.createManager, this.exitCode)
    };

    //The checkFor continuation function recieves 3 parameters.  It recieves a question, function to be called if confirmed yes
    //and function to be called if confirmed no
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

    //the create manager function is an inquirer prompt that is used in the beginning of the code to prompt the Team manager for their information
    //
    createManager(mainObj) {

        //this is the inquirer code that holds all the questions that will shown through terminal when create manager is called
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

                //This line is create a new instance manager with the information return from the inquirer response object ans 
                const manager = new Manager(ans.teamManager, ans.ID, ans.email, ans.officeNumber)

                //push this new manager to the this.team array
                mainObj.team.push(manager);

                mainObj.numOfTeamMembers++;
                //navigate the user to the next step which is the finalCheck() function
                mainObj.finalCheck(mainObj);
            });

    };

    //the addEmployee function receives a this object as a parameter.  This is because my scope is lost when I run my code early on through my checkForContinuation function
    addEmployee(mainObj) {
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
                    choices: [roles[1], roles[2]]
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
                //this if statement runs the code within if the role picked by the user is engineer
                if (emplAns.employeeRole == "engineer") {
                    //another inquirer is run to add the github username question for the user
                    return inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'gitHub',
                                message: questions.gitHub
                            }
                        ]).then(val => {
                            //this code creates a new instance of Engineer with information from the first inquirer response and the inquirer
                            //for the gitHub username question above
                            const engineer = new Engineer(emplAns.name, emplAns.ID, emplAns.email, val.gitHub);
                            mainObj.numOfTeamMembers++
                            //add the engineer instance to the this.team array
                            mainObj.team.push(engineer);
                            //take user back to finalCheck function
                            mainObj.finalCheck(mainObj);
                        });
                } else {
                    //another inquirer is run to add the school question for the user
                    return inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'school',
                                message: questions.school
                            }
                        ]).then(val => {
                            //this code creates a new instance of Intern with information from the first inquirer response and the inquirer
                            //for the school name above
                            const intern = new Intern(emplAns.name, emplAns.ID, emplAns.email, val.school);

                            mainObj.numOfTeamMembers++
                            //add the new intern instance to the this.team array
                            mainObj.team.push(intern);
                            //take user back to finalCheck function
                            mainObj.finalCheck(mainObj);
                        });
                };
            });
    };

    //The printTeamInfo function is run when the user choose to review their team in the finalCheck() function
    printTeamInfo(mainObj) {
        console.log(`Current number of members on team: ${mainObj.numOfTeamMembers}`);
        console.log(`\n`);
        //this for loop runs for every member of the team in the thi.team array
        for (let i = 0; i < mainObj.numOfTeamMembers; i++) {

            //this is functionality that was added for the delete feature however I have not fully completed that part of menu
            //The if else statements below run because all three roles of the employee manager, engineer, and intern each have a specific keyname in
            //them for specific information.  So I need to run slightly different code based on the role of the team member
            if (mainObj.team[i] == "undefined") {
                console.log("Member deleted");
                delete team[i]

            } else if (mainObj.team[i].getRole() === "Manager") {
                //printInfo() is a function declared in the employee.js and it prints all the info that all employees share
                mainObj.team[i].printInfo()
                //code to console.log the one piece of info specific to the manager.
                console.log(`Office Number: ${mainObj.team[i].getOfficeNumber()}`);

            } else if (mainObj.team[i].getRole() === "Engineer") {
                mainObj.team[i].printInfo()
                console.log(`GitHub Username: ${mainObj.team[i].getGithub()}`);

            } else {
                mainObj.team[i].printInfo()
                console.log(`School: ${mainObj.team[i].getSchool()}`);
            }
            //line break add for viewability
            console.log(`\n`);
        };

        //this function confirms if the user is happy with the team or whether they want to edit a team member
        this.checkForContinuation(questions.editTeamPrompt, this.editTeamPrompt, this.finalCheck)
    }

    //This function is called to edit the information of a current teammember
    editTeamPrompt(mainObj) {
        //delclare an empty array to have the names of the team members pushed into
        const choicesTeamNames = [];
        //this for loop takes the empty array above and pushes all the team members into it
        for (let i = 0; i < mainObj.numOfTeamMembers; i++) {
            choicesTeamNames.push(mainObj.team[i].getName());
        }
        //run an inquirer with the names of the team members as the choices to the to edit question
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
                //take the member that was chosen to be edited and perform a filter method on the this.team array to return the team member
                //whose name matches the name that was chosen
                const memberToEdit = mainObj.team.filter(index => {
                    return index.getName() === memberName
                })
                //this line of code now navigates the user to the editTeamMember function with the memeber to be edited as a parameter
                mainObj.editTeamMember(memberToEdit);
            });
    }
    //This functin will edit 
    editTeamMember(wrongTeamMember) {

        const operations = [
            "name",
            "ID",
            "email",
        ]
        //this set of if else statements exist to add the desired field to be edited based on the role of the team member that was selected to be edited
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

                //this set of if else statements takes the new value input by the user and sets it equal to the value of the correct keyname overriding the old content
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

                //This function confirms that the user is done editing that team member
                this.checkForContinuation(questions.doneEditing, this.finalCheck, this.editTeamPrompt);
            });
    }

    //this function is the main menu that provides the user with a lot of function
    //review current team, render html, edit team member, add a team member, delete a team member 
    finalCheck(mainObj) {
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
                    mainObj.printTeamInfo(mainObj)
                } else if (val.operation === "Proceed to html render") {
                    mainObj.renderHTML(mainObj)
                } else if (val.operation === "Edit Team Member") {
                    mainObj.editTeamPrompt(mainObj)
                } else if (val.operation === "Delete Team Member") {
                    mainObj.deleteTeamMember(mainObj)
                } else {
                    mainObj.addEmployee(mainObj)
                }
            })

    }

    //The intent of this function is to delete an instance of a team member from the this.team array
    deleteTeamMember(mainObj) {
        const choicesTeamNames = [];
        for (let i = 0; i < mainObj.numOfTeamMembers; i++) {
            choicesTeamNames.push(mainObj.team[i].getName());
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
                mainObj.team = mainObj.team.filter(index => {
                    return index.getName() !== memberName
                })
                console.log(mainObj.team);
                mainObj.finalCheck(mainObj);
            });
    }

    exitCode(mainObj) {
        throw "See you later!"
    };

    //This function renders all the content in the htmlArr string to the html.  
    //It also creates the html and takes a this obj as a parameter because scope is lost through checkForContinuation function
    renderHTML(mainObj) {

        //the this.htmlArr is set equal to the output of an async function which is a Promise.  So to work with the content a .then() is needed
        this.htmlArr.then((val) => {

            let teamHtml = "";
            let noCommas = "";

            //this line of code performs a map function this.team object
            //the output which is an array is set equal to the const mapArr
            const mapArr = mainObj.team.map(function (teamMember) {

                let htmlNew = "";

                //if the role of the specified team is manager find the spots one by one that I marked in the html to receive content 
                //then replace the specifically marked areas in html with the corresponding content in the team member.
                if (teamMember.getRole() === "Manager") {

                    htmlNew = val[0].replace("((((Name))))", teamMember.getName());
                    htmlNew = htmlNew.replace("((((Role))))", teamMember.getRole());
                    htmlNew = htmlNew.replace("((((ID))))", teamMember.getId());
                    htmlNew = htmlNew.replace("((((Email))))", teamMember.getEmail());
                    htmlNew = htmlNew.replace("((((Office Number))))", teamMember.getOfficeNumber());

                } else if (teamMember.getRole() === "Engineer") {

                    htmlNew = val[1].replace("((((Name))))", teamMember.getName());
                    htmlNew = htmlNew.replace("((((Role))))", teamMember.getRole());
                    htmlNew = htmlNew.replace("((((ID))))", teamMember.getId());
                    htmlNew = htmlNew.replace("((((Email))))", teamMember.getEmail());
                    htmlNew = htmlNew.replace("((((Github Username))))", teamMember.getGithub());

                } else {

                    htmlNew = val[2].replace("((((Name))))", teamMember.getName());
                    htmlNew = htmlNew.replace("((((Role))))", teamMember.getRole());
                    htmlNew = htmlNew.replace("((((ID))))", teamMember.getId());
                    htmlNew = htmlNew.replace("((((Email))))", teamMember.getEmail());
                    htmlNew = htmlNew.replace("((((School))))", teamMember.getSchool());
                }
            
                return htmlNew

            });

            //join the mapArr into one long string and also replace all the commas, that are placed in html because the exist between indexes of an array, with spaces.
            noCommas = mapArr.join().replace(/,/g, " ");

            //Take the html string with no commas and place it into the main html at the spot marked for input
            teamHtml = val[3].replace("((((Team Members Go Here))))", noCommas);
            //Write the complete html file to the main folder
            fs.writeFile("team.html", teamHtml, function (err) {
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

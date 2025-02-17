const validator = require("validator");

const signupvalidate = (req) => {

    const { firstName , lastName,email, password } = req.body;

    if (!firstName?.trim() || !lastName?.trim()) {
        throw new Error("First Name and Last Name is required");
    }
    if(!validator.isEmail(email)){
        throw new Error("Email is not valid");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("password must contain  minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1");
    }

}

const isUpdateValid = (req) => {
const allowsupdates = ["firstName","lastName","email","age","skills","photoUrl","bio","gender"];
const isValidUpdate = Object.keys(req.body).every((update) => allowsupdates.includes(update));
if(!isValidUpdate){
    throw new Error("Invalid update details");

}
};

module.exports ={ signupvalidate,
    isUpdateValid 
   
}
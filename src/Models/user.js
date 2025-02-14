const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20,
    },
    lastName: {
        type: String,    
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(values){
            if(!validator.isEmail(values)){
                throw new Error("Email is not valid"+ values)
            }
        }

    },
    password: {
        type: String,
        required: true,
        minlength: 6, 
        validate(values) {
           if(!validator.isStrongPassword(values)){
               throw new Error("password must contain  minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 "+ values)
           }
        }
},
    age: {
        type: Number,
        validate(value) {
            if (value < 18) {
                throw new Error("Age must be at least 18 years old");
            }
        }
       
    },
    gender: {
        type: String,
        validate(value){
            
                if(! ["male","female","other","Male","Female","Other"].includes(value)){
                    throw new Error("gender not valid")
            } 
    },
},
    photoUrl:{
        type: String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        validate(values){
            if(!validator.isURL(values)){
                throw new Error("URL is not valid"+ values )
        }
    }
},
    bio:{
        type: String,
        maxlength:100,
        default: "I am a developer",  
    },
     skills:{
              type:[String],
        }
    },
    {
        timestamps: true
    }
);

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;

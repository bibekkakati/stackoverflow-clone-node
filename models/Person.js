const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  profilepic: {
    type: String,
    default:
      "https://scontent.fgau1-1.fna.fbcdn.net/v/t1.0-9/37582370_300216277391522_5305780036568088576_n.jpg?_nc_cat=102&_nc_oc=AQkhSXUytf8euIRu5pT-Jd08Ro-n9y4TYVsqV6jkTulMmRfzdYQJqq-prOkQbSHjGl5Gg2oOxMsRWXNHBjd8cbHG&_nc_ht=scontent.fgau1-1.fna&oh=ecb3deb355cf1f5128503addaa8bb213&oe=5E63B48E"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Person = mongoose.model("myPerson", PersonSchema);

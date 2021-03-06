const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

var sequelize = new Sequelize("postgres://postgres:secret@localhost:5432/auth");

// setup User model and its fields.
var User = sequelize.define(
  "users",
  {
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },

  {
    // timestamps: false,
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      },
    },
    instanceMethods: {
      validPassword: function (password) {
        return bcrypt.compareSync(password, this.password);
      },
    },
  }
);

// create all the defined tables in the specified database.
sequelize
  .sync() // .sync({ force: true })
  .then(() =>
    console.log(
      "users table has been successfully created, if one doesn't exist"
    )
  )
  .catch((error) => console.log("This error occured", error));

// export User model for use in other files.
module.exports = User;

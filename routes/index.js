const loginRoute = require("./login");
const constructorMethod = app => {
    app.use("/", loginRoute);
};
module.exports = constructorMethod;

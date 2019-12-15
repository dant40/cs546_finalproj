const session = require('express-session')
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const path = require('path');



app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true
}));

configRoutes(app);
app.listen(3000, function() {
    console.log('Site is up at on port 3000! Navigate to http://localhost:3000 to access it');
});
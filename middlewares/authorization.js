const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const authorization = (req, res, next) => {
    const token = req.cookies.auth_token;
    // const data = req.body.companyCode
    // console.log("this is parmas", req.params.id)
    // console.log("this is daya", data)
    if (!token) {
        return res.status(401).send("please login");
    }
    try {
        const data = jwt.verify(token, process.env.MyScreatkey);
        req.userId = data.id;
        req.userRole = data.role;
        
        return next();
    } catch (err) {
        
        res.send(err).status(401);
    }
};

module.exports = authorization;

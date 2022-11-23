const express = require("express")

const router = express.Router()

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

let options = { format: 'A4' };

function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(secs);
    return t;
}

 router.post("", async (req, res) => {
    try {
        const { email, password } = req.body


        if (email != "superadmin@gmail.com") {
            return res.status(500).send({
                status: "failure",
                message: "Email address is invalid",
                data:[]
            })
        }
        if (password != "admin@12345") {
            return res.status(500).send({
                status: "failure",
                message: "Email address is invalid",
                data: []
            })
        }


        if (email == "superadmin@gmail.com" && password == "admin@12345") {
            let token = jwt.sign({ email: "superadmin@gmail.com" }, process.env.MyScreatkey);

            let sec = (new Date() / 1000) + 864000 
            var expiryDate = toDateTime(sec)          

              res
                  .cookie("auth_token", token, {
                    httpOnly: false,
                    expires: expiryDate,
                })
                .status(200)
                .send("you login sucessfully")
            
        }
        else {
            return res.status(400).send("password wrong");
        }
    }
    catch (err) {
        return res.status(500).send(err);
    }

})




module.exports = router;
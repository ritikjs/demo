const companyModal = require("../model/company");
const employeeModal = require("../model/employee");


const CompanyCodeMiddleware = async (req, res, next) => {

    // console.log(req.params.id)
    if (!req.body.companyCode) {
        return res.status(500).send({
            status: "failure",
            msg: "please provide a Company code",
            data: []
        })
    }

    const employee = await companyModal.findOne({
        companyCode: req.body.companyCode
    });

    if (employee) {
        return next()
    }


    return res.status(500).send({
        status: "failure",
        msg: "Company code is invalid",
        data: []
    })

}





module.exports = CompanyCodeMiddleware; 
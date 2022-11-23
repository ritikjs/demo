const employeeModal = require("../model/employee");




const EmployeeCode = async (req, res, next) => {

    // console.log(req.params.id)

    const employee = await employeeModal.findOne({
        employeeCode: req.params.id
    });
 
    if (employee) {
        return next()
    }


    return res.status(500).send({
            status: "failure",
            msg: "employee code is invalid",
            data: []
        })

}





module.exports = EmployeeCode; 
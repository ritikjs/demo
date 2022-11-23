
const express = require("express");
const router = express.Router();




router.get("/", async (req, res) => {
  try {
    
    const newdata = {
      unit: [
        "for unit Data use /sitelist",
        "for single unit data use /sitelist/:id ",
      ],
      Company: [
        "for Company Data use /companylist",
        "for single company data use /companylist/:id ",
      ],
      Employee: [
        "for employee quick form Data use /employeelist",
        "for single employee quick form Data use /employeelist/:id",
      ],
      EmployeeEnrollmentform: [
        "for employee Enrollment form Data use /employeeform",
        "for SingleCompany Data with all unit and details use /fullcompany/:companyid",
      ],
    };

    res.send(newdata).status(200);
  } catch (err) {
    res.send(err).status(500);
  }
});



module.exports = router;
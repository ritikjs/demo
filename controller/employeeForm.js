const express = require("express");
const router = express.Router();
const employeeFormModal = require("../model/employeeForm");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const upload = require("../middlewares/uploads");



router.get("", async (req, res) => {
  try {
    const employeeD = await employeeFormModal
      .find({ isActive: true })
      .populate("companyDetails", "companyCode")
      .populate("siteDetails", "siteCode")
      .then((list) => {
        if (list.length <= 0) {
          return res.status(500).send({
            status: "failure",
            msg: ("employee list is Empty"),
            data: []
          })
        }
        else {
          return res.status(200).send({
            status: "success",
            msg: "employee list",
            data: list
          })
        };

      })
      .catch((err) => {
        return res.status(500).send(err);
      })
 
  } catch (err) {
    res.send(err).status(500);
  }
});




router.post("", async (req, res) => {
    try {
      // console.log(req.file.path);

      const employee = await employeeFormModal.create({
        ...req.body,
      });

      return res.status(201).send(employee);
    } catch (err) {
      res.send(err).status(500);
    }
  }
);





//// for update data by id/////
router.patch("/:id", async (req, res) => {
  try {
    const employeeform = await employeeFormModal.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    )

      if (!employeeform ) {
      
        return res.status(500).send("empty")

      }

    // console.log("this is employeeform", employeeform)

    return res.status(201).send(employeeform);
  } catch (err) {
    res.send(err).status(500);
  }
});

//// delete by id/////

router.delete("/:id", async (req, res) => {
  try {
    const employeeform = await employeeFormModal.findByIdAndDelete(
      req.params.id
    );

    return res.status(201).send(employeeform);
  } catch (err) {
    res.send(err).status(500);
  }
});





module.exports = router;

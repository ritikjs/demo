// var fs = require("fs");

//importing excel4node package npm packege
const xl = require('excel4node');

const express = require("express");

const router = express.Router();

// importing modals from model folder

const companyModal = require("../../model/company");
const employeeModal = require("../../model/employee");

// how many employee enroll in giving date rang convert into excel



router.post("", async (req, res) => {

    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Worksheet Name');
    try {

        const companyId = req.body.companyId
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;

        // console.log(companyId)
        // console.log(companyId, startDate, endDate)

        const EmployeeDetails = await employeeModal.find({
            CompanyDetail: companyId,
            createdAt: {
                $gte: (`${startDate}`),
                $lte: (`${endDate}`)
            }
        }, {}, { lean: true })
            .then((res) => {
            return res
            })
            .catch((err) => {
            return res.status(500).send(err);
            })
        
        
        
        if (EmployeeDetails.length <= 0){
            return res.status(500).send("no any employee enrolled");
        }

        
        let headingColumnIndex = 1;


    // heading for excel document forEach of obj keys from EmployeeDetails
            
        Object.keys(EmployeeDetails[0]).forEach(heading => {
            ws.cell(1, headingColumnIndex++)
                .string(heading)
        });

        let rowIndex = 2;

    //  for excel document forEach of obj keys from EmployeeDetails
        
        EmployeeDetails.forEach(record => {
            let columnIndex = 1;

            Object.keys(record).forEach(columnName => {
                // console.log("this is", JSON.stringify(record[columnName]))
                
                ws.cell(rowIndex, columnIndex++)
                    .string(JSON.stringify(record[columnName]))
                    // cell.setCellType(Cell.CELL_TYPE_STRING);
            });

            rowIndex++;
        });
        

        wb.write('data.xlsx', res);

        // res.send("EmployeeDetails").status(200);
    }
    catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router;



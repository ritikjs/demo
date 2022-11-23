//all pacakge install////
const express = require('express')
const app = express()
//for port/////
const PORT = process.env.PORT || 8080
const bodyParser = require('body-parser')
const path = require('path');


// this is dotenv packe
const dotenv = require('dotenv');
dotenv.config();

//importing connect from db.js
const connect = require("./configs/db");
//importing cokkies



//importing router from controller folder//
const Documention = require("./controller/home")
const employeeDetails  =  require("./controller/employee")
const companyController = require("./controller/company")
const siteController = require("./controller/site");
const FliterController = require("./controller/fullinfo");
const employeeFormController = require("./controller/employeeForm");
const SuperAdmin = require("./controller/SuperAdmin")
const Downlaod = require("./controller/Download")
const Inventory = require("./controller/Inventory")
const VendorController = require("./controller/Vendor")
const Payslip =  require("./controller/Pdf/Payslip")
const ExcelData = require("./controller/Excel/ExcelController")
const ClientController = require("./controller/client")
const AdminController = require("./controller/admin")
const AttendanceController = require("./controller/attendance")
const Fieldofficer  =  require("./controller/fieldofficer")

// for cookies



const cookieParser = require("cookie-parser");
app.use(cookieParser());


app.use(bodyParser.json());
// for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
// for parsing application/x-www-form-urlencoded



//cors for cors error its a package

const cors = require('cors');
const corsOptions = {
  origin: '',
  credentials: true,            
  
}


app.use(cors(corsOptions));

app.use(
  express.urlencoded({
    extended: true,
  })
);



app.use(express.json());



// for documention/
app.use("/", Documention);

app.use("/employeelist", employeeDetails);
app.use("/companylist", companyController);
app.use("/sitelist", siteController);
app.use("/fullcompany", FliterController);
app.use("/employeeform", employeeFormController);
app.use("/superadmin", SuperAdmin)
app.use("/down",Downlaod )
app.use("/inventorylist", Inventory)
app.use("/vendorlist", VendorController)
app.use("/payslip", Payslip)
app.use("/excel", ExcelData)
app.use("/clientlist", ClientController)
app.use("/admin", AdminController)
app.use("/attendance", AttendanceController)
app.use("/fieldofficer", Fieldofficer)



app.use(express.static('public'));

app.use('/PaySlipPdf', express.static(path.join(__dirname, 'PaySlipPdf')));




//for listen port



app.listen(PORT, async() => {
    try{
    connect()
    console.log(`Server running on port ${PORT}`)
    }
    catch {
    console.log(`Server is not running`)
    }
  })
const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const InventryModal = require("../model/inventory");
const CompanyCodeMiddleware = require("../middlewares/inventory");
dotenv.config();


router.get("", async (req, res) => {
    try {
        const Inventory = await InventryModal.find({ isActive: true }).lean()
            .then((list) => {
                if (list.length <= 0) {
                    return res.status(500).send({
                        status: "failure",
                        msg: ("Inventory list is Empty"),
                        data: []
                    })
                }
                else {
                    return res.status(200).send({
                        status: "success",
                        msg: "Inventory list",
                        data: list
                    })
                }})
            .catch((err) => {

                return res.status(500).send({
                    status: "failure",
                    msg: (err.message || "Internal Server Error"),
                    data: []
                })

            });

        // console.log(Inventory)

        // if (Inventory.length<=0) {
        //     return throwObjWithStacktrace("not found" , 404);
        // }
        // return res.status(200).send(Inventory);
    }
    catch (err) {
        return res.status(500).send({
            status: "failure",
            msg: (err.message || "Internal Server Error"),
            data: []
        })
    }

});



router.get("/companycode", CompanyCodeMiddleware, async (req, res) => {
    // console.log("fdhgbfj")
    try {
        const Inventory = await InventryModal.find({
            isActive: true,
            companyCode: req.body.companyCode
        })
            .lean()
            .then((list) => {
                if (list.length <= 0) {
                    return res.status(500).send({
                        status: "failure",
                        msg: ("Inventory list is Empty"),
                        data: []
                    })
                }
                else {
                    return res.status(200).send({
                        status: "success",
                        msg: "Inventory list",
                        data: list
                    })
                }
            })
            .catch((err) => {

                return res.status(500).send({
                    status: "failure",
                    msg: (err.message || "Internal Server Error"),
                    data: []
                })

            });
    }
    catch (err) {
        return res.status(500).send({
            status: "failure",
            msg: (err.message || "Internal Server Error"),
            data: []
        })
    }

});


// get product 
router.get("/:id", async (req, res) => {
    try {

        // console.log(req.params.id)

        const Inventory = await InventryModal.findOne({
                isActive: true,
                productId: req.params.id
            }).select({
            productName:1,
            productId:1
        }).lean()
            .then((list) => {
                if (!list) {
                    return res.status(500).send({
                        status: "failure",
                        msg: ("ProductId is Wrong"),
                        data: []
                    })
                }
                else {
                    return res.status(200).send({
                        status: "success",
                        msg: "Inventory",
                        data: [list]
                    })
                }
            })
            .catch((err) => {

                return res.status(500).send({
                    status: "failure",
                    msg: (err.message || "Internal Server Error"),
                    data: []
                })

            });

    }
    catch (err) {
        return res.status(500).send({
            status: "failure",
            msg: (err.message || "Internal Server Error"),
            data: []
        })
    }

});



// get only product name and id
// router.get("/product", async (req, res) => {
//     try {
//         const Inventory = await InventryModal.find({ isActive: true })
//             .select({
//             productName:1,
//             productId:1
//         }).lean()
//             .then((list) => {
//                 if (list.length <= 0) {
//                     return res.status(500).send({
//                         status: "failure",
//                         msg: ("Inventory list is Empty"),
//                         data: []
//                     })
//                 }
//                 else {
//                     return res.status(200).send({
//                         status: "success",
//                         msg: "Inventory list",
//                         data: list
//                     })
//                 }
//             })
//             .catch((err) => {

//                 return res.status(500).send({
//                     status: "failure",
//                     msg: (err.message || "Internal Server Error"),
//                     data: []
//                 })

//             });

//         // console.log(Inventory)

//         // if (Inventory.length<=0) {
//         //     return throwObjWithStacktrace("not found" , 404);
//         // }
//         // return res.status(200).send(Inventory);
//     }
//     catch (err) {
//         return res.status(500).send({
//             status: "failure",
//             msg: (err.message || "Internal Server Error"),
//             data: []
//         })
//     }

// });




// get product by company id





// post inventory 
router.post("",    CompanyCodeMiddleware,  async (req, res) => {
    try {        
        

        const InventryList = await InventryModal.find({}).lean();

        let emplyeelength = InventryList.length + 1
        let str = "" + emplyeelength
        let pad = "000"
        let ans = pad.substring(0, pad.length - str.length) + str

        let ProductId = `PRO${ans}`

        const Inventory = await InventryModal.create({
            ...req.body,
            productId: ProductId
        })


        if (Inventory){
            return res.status(200).send({
                status: "success",
                msg: "Inventory created",
                data: [Inventory]
            })
        }
        else {
            
            return res.status(500).send({
                status: "failure",
                msg: ("Inventory not created"),
                data: []
            })
        }

    }
    catch (err) {
       
        // console.log(objectKey)

        if (err.code == 11000) {
            const objectKey = Object.keys(err?.keyValue)[0];
            return res.status(500).send({
                status: "failure",
                msg: (`${objectKey} already exists`),
                data: []
            })
        }

        return res.status(500).send({
            status: "failure",
            msg: (err.message || "Internal Server Error"),
            data: []
        })
    }

})



//// for update inveentory data ////////////////
router.patch("/:pname",  async (req, res) => {
    try {
        const ProductName = req.params.pname

        // const [product] = await InventryModal.find({ ProductName });
        // let produtId = product._id
        // let Purchase = product.Purchase
        
        // if (!Purchase) {
        //     return throwObjWithStacktrace(404)
        // }

        const Inventory = await InventryModal.findOneAndUpdate(
           { ProductName},
            {...req.body},
            {new: true}
        );

        if (Inventory) {
            return res.status(200).send({
                status: "success",
                msg: "Inventory updated successfully",
                data: [Inventory]
            })
        }
        else {

            return res.status(500).send({
                status: "failure",
                msg: ("Inventory not updated"),
                data: []
            })
        }
    
    } catch (err) {
        return res.status(500).send({
            status: "failure",
            msg: (err.message || "Internal Server Error"),
            data: []
        })
    }
});




router.delete("/:id", async (req, res) => {
    try {
        const productId = req.params.id

        const Inventory = await InventryModal.findOneAndDelete(
            { productId },
            {new : true}
        )

        if (Inventory) {
            return res.status(200).send({
                status: "success",
                msg: "Inventory deleted",
                data: [Inventory]
            })
        }
        else {

            return res.status(500).send({
                status: "failure",
                msg: ("Inventory not deleted"),
                data: []
            })
        }

    } catch (err) {
        return res.status(500).send({
            status: "failure",
            msg: (err.message || "Internal Server Error"),
            data: []
        })
    }
});







module.exports = router;

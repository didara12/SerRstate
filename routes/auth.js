const express = require('express');
const { Real_state } = require('../DB/connecte');
const multer = require('multer')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + Date.now() + uniqueSuffix+'.jpg');
    //   cb(null, file.originalname);
    },
  });

const upload = multer({ storage: storage });


const authRoute = express.Router()

authRoute.post('/auth/add', upload.array('images', 6),async(req,res)=>{
    const formikValues = req.body; // Assuming form data is sent in the request body


    const images = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`)

        try {
            const villaData = {
                type: 'Villa',
                name: formikValues.name,
                location: {
                    city: formikValues.city,
                    neighborhood: formikValues.neighborhood, // You may need to adjust based on your form data
                    country: formikValues.country,
                    zipcode: ''
                },
                features: {
                    bedrooms: formikValues.beds,
                    bathrooms: formikValues.baths,
                    garages: 0, // Assuming not provided in the form
                    area: '',
                    lotSize: '',
                    floors: 2,
                    swimmingPool: formikValues.offer,
                    garden: formikValues.parking,
                    balcony: formikValues.furnished
                },
                description: formikValues.description,
                price: {
                    amount: formikValues.regularPrice,
                    currency: 'USD' // Assuming a default currency
                },
                images,
                contact: {
                    agent: '',
                    email: '',
                    phone: ''
                },
                uid:formikValues.uid
            };
    
            const villa = new Real_state(villaData)
            const savedVilla  = await villa.save()
            

            res.status(200).json({suc:'villa added successfully',id:savedVilla._id.toString(),savedVilla})
        } catch (error) {
            console.error('Error saving villa:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
    
        }

})


authRoute.post('/auth/delete', async (req,res)=>{
    try{
        const {_id} = req.body
        const vdata = await Real_state.deleteOne({_id})

        let data = []
        if(typeof vdata === "object"){ // i tanke this is wrong, bc [] and {} both return object ... ask 
            data.push(vdata)
        }else{
            data = vdata
        }

        res.json(data)
    
    }catch(e){
        console.log(e.message)
    }
})


module.exports = authRoute
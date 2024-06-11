module.exports = {


  //product adding;

  addProduct : async(req,res)=>{
    
    console.log('Product added successfully!',req.body)
    //res.send({ message: "Product added successfully!" }); // Or handle errors

  },


  //authentication
    login: (req, res) => {
      try {
        const data = req.body; // Access data sent in the request body
  
        // Validate and process data
        console.log(data); // Example: Log received data
        res.send({ message: "Data received successfully!" }); // Send a response
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
      }
    },
  
    logout: () => {},
  };
  
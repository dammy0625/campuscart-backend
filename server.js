const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const connectDB = require("./db");
const Listing = require('./models/listing'); // Import the Listing model
const mongoose = require('mongoose');
const { v2 : cloudinary } = require('cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const crypto = require('crypto');
const path = require('path');
const passport = require("passport");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const authRoutes = require("./auth")
const cookieParser = require("cookie-parser");
require("./auth");
const { ObjectId } = require("mongodb");



//const universities = require('nigerian-universities');

// Retrieve the list of universities
//const universityList = universities;

// Example: Display the first university's details
//console.log(universityList);

const app = express();
const PORT = 5000;

// Connect to MongoDB Atlas
connectDB();
//console.log('Cloudinary API Key:', process.env.CLOUDINARY_API_SECRET); // Outputs your Cloudinary cloud name

// Middleware


app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For URL-encoded data
app.use(cookieParser()); // Must be before your routes!


app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(
  session({ 
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);











cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Set up Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'listings', // Folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({storage });


// Routes
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Google OAuth Login Route
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback Route
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Generate JWT Token
    const token = jwt.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    
    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  }
);

app.get('/listings', async (req, res) => {
    try {
      const listings = await Listing.find().sort({ createdAt: -1 }); // Assuming `Listing` is your model
      res.status(200).json(listings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching listings.' });
    }
  });
  
  app.get('/listings/:id', async (req, res) => {
   // console.log("Incoming Request for ID:", req.params.id);  // Log the request
    try {
      const product = await Listing.findOne({ _id: new ObjectId(req.params.id) });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching the product.' });
    }
  });
  
// Upload route
app.post('/upload', upload.array('images', 10), async (req, res) => {
  try {
   
         // Check if files were uploaded
         if (!req.files || req.files.length === 0) {
          return res.status(400).json({ success: false, message: 'No files uploaded' });
      }

  // Debug log for req.files
  console.log( req.files);
  const uploadPromises = req.files.map((file) =>
    cloudinary.uploader.upload(file.path, {
      folder: 'listings',
    })
  );

      // Wait for all uploads to finish
      const results = await Promise.all(uploadPromises);

      // Extract URLs from Cloudinary response
      const urls = results.map((result) => result.secure_url);

      
    // Send back a proper JSON response
    res.json({
      success: true,
      message: 'Images uploaded successfully',
      urls,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message,
    });
  }
});



  
 
  // Route to create a new listing
  
app.post("/listings",upload.array("images", 10), async (req, res) => {
  console.log("Received request to create listing");

  try {
    if (!req.files || req.files.length === 0) {
      console.log("No files uploaded");
      return res.status(400).json({ success: false, message: "No images uploaded" });
    }

     // Log the received files for debugging
    // console.log("Files received:", req.files);

   // Process all uploaded images
   const uploadPromises = req.files.map((file) =>
    cloudinary.uploader.upload(file.path, {
      folder: "listings", // Folder in Cloudinary
    })
  );
    // Wait for all uploads to finish
    const uploadResults = await Promise.all(uploadPromises);

    // Extract URLs from Cloudinary response
    const imageUrls = uploadResults.map((result) => result.secure_url);

    // Create a new listing object
    const newListing = new Listing({
      id: req.body.id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      location: req.body.location,
      category: req.body.category,
      images: imageUrls,
    });

    // Save to database
    await newListing.save();
   // console.log("Listing saved:", newListing);

    res.status(201).json({
       success: true,
        listing: newListing });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Error creating listing" });
  }
});





app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


app.post("/listings",upload.array("images", 10), async (req, res) => {
 // console.log("Received request to create listing");

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

     // 🔹 Authenticate user
     const token = req.cookies.jwt;
     if (!token) {
       return res.status(401).json({ message: "Unauthorized" });
     }

     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    // Create a new listing object
    const newListing = new Listing({
      id: req.body.id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      location: req.body.location,
      category: req.body.category,
      images: imageUrls,
      user: user._id, // Assign the authenticated user
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

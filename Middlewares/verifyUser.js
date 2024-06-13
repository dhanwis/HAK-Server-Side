const verifyJWT = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Unauthorized' });
      }
  
      const token = authHeader.split(' ')[1];
  
      // Verify the JWT token using your secret key
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).send({ message: 'Forbidden' }); // Access token might be expired
        }
  
        // Attach decoded user data (e.g., user ID) to request object
        req.userId = decoded.userId;
        next();
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  };
  
  // Example usage in a protected route
  app.get('/api/cart', verifyJWT, (req, res) => {
    // Access user data using req.userId (if needed)
    const userId = req.userId;
    // ... (your logic to fetch cart data using userId)
    res.send(cartData);
  });
  
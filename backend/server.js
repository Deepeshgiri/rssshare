const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;


app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        
        return fetch('http://localhost:5000/update', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                "key": "d6a30526-8d23-4f57-9acb-c7a07925ea93",
                "message": "db connected"
            })
        });
    })
    .then(response => response.json()) // Convert the response to JSON
    .then(data => {
        console.log("Response from server:", data); // Log the response
    })
    .catch(err => {
        console.log("Error:", err);
    });

// Simple route
app.get('/', (req, res) => {
    res.send('Welcome to the Resource Sharing Platform!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

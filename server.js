const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Multer setup for package images
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'images'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


// =========================
// 📝 POST /bookings
// =========================
app.post('/bookings', (req, res) => {
    const {
        dishName, email, ingredients, quantity,
        budget, deliveryMethod, specialInstructions, image
    } = req.body;

    const newBooking = {
        id: Date.now().toString(),
        dishName,
        email,
        ingredients,
        quantity,
        budget,
        deliveryMethod,
        specialInstructions,
        image
    };

    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ message: 'Server error' });

        try {
            const db = JSON.parse(data || '{}');
            db.bookings = db.bookings || [];
            db.bookings.push(newBooking);

            fs.writeFile('db.json', JSON.stringify(db, null, 2), 'utf8', (err) => {
                if (err) return res.status(500).json({ message: 'Failed to save booking' });
                res.status(201).json({ message: 'Booking submitted', booking: newBooking });
            });
        } catch (parseErr) {
            return res.status(500).json({ message: 'Data error' });
        }
    });
});

// =========================
// ✅ Start server
// =========================
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});

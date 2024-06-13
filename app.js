const express = require('express');
const app = express();
const User = require('./model/User');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const csv = require('csvtojson');

app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'uploads')));

const dbconnect = async () => {
    await mongoose.connect('mongodb://localhost:27017/athar');
    console.log('db connect successfully');
};
dbconnect();

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

let uploads = multer({ storage: storage });

app.post('/', uploads.single('file'), async (req, res) => {
    try {
        let userdata = [];
        csv().fromFile(req.file.path).then(async (csvData) => {
            for (let i = 0; i < csvData.length; i++) {
                userdata.push({
                    name: csvData[i].name,
                    email: csvData[i].email,
                });
            }

            await User.insertMany(userdata);

            return res.json({
                msg: "File uploaded successfully",
            });
        }).catch((err) => {
            return res.json({
                msg: err.message
            });
        });
    } catch (err) {
        return res.json({
            msg: err.message
        });
    }
});

app.listen(3000, () => {
    console.log('server started');
});

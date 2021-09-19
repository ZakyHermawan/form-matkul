const express = require('express');
const app = express();

const path = require('path');
const port = 3000;
const router = express.Router();
const public = path.join(__dirname, '../public');
const mongoose = require('mongoose');
const conn = mongoose.connection;

mongoose.connect('mongodb://localhost:27017/node-divkom', {useNewUrlParser: true});

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use('/', router);
app.use('/', express.static(public));


// we should use separate files, but im to lazy to do so :(

// models
const matkulSchema = new mongoose.Schema({
    kode_matkul: String,
    nama_matkul: String,
    nama_dosen: String
});

Matkul = mongoose.model('matkul', matkulSchema);


const sendTemplate = (res, _path) => {
    res.sendFile(path.join(public + _path));
}

// async handler
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    });
}

// routing
router.get('/', (req, res) => {
    console.log("Home page");
    sendTemplate(res, '/index.html');
});

router.get('/getAll', catchAsync(async (req, res)=> { 
    console.log("Get all data")
    const all = await Matkul.find({});
    console.log(all);
    res.send(all);
}))

router.get('/show', (req, res) => {
    console.log("Show data page");
    sendTemplate(res, '/showData.html');
});

router.get('/form', (req, res) => {
    sendTemplate(res, '/form.html');
});

router.get('/delete', (req, res) => {
    sendTemplate(res, '/deleteData.html');
})

router.post('/form', catchAsync(async (req, res) => {
    console.log(req.body)
    const kodeMatkul = req.body['kode matkul'];
    const namaMatkul = req.body['nama matkul'];
    const namaDosen = req.body['nama dosen'];
    data = {
        kode_matkul: kodeMatkul,
        nama_matkul: namaMatkul,
        nama_dosen: namaDosen
    }
    filter = {
        kode_matkul: kodeMatkul
    }
    console.log(data)
    await Matkul.findOneAndUpdate(filter, data, {upsert: true, new: true}).lean();

    res.redirect('/show');
}));

router.post('/delete', catchAsync(async(req, res) => {
    const kodeMatkul = req.body['kode matkul'];
    const query = {
        kode_matkul: kodeMatkul
    }

    const result = await Matkul.deleteOne(query);
    console.log(`${query} berhasil di remove!`);
    res.redirect('/show');
}))

app.listen(port, () => {
    console.log(`App runnning at ${port}`);
})

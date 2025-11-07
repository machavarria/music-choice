// Used code from savage demo to help make this project


const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://marcachavarria3_db_user:8uda2ZOAVSeCaa5p@cluster0.8fmgguf.mongodb.net/Cluster0?appName=Cluster0";
const dbName = "Cluster0";


app.listen(3005, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('songs').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {songs: result})
  })
})

app.post('/songs', (req, res) => {
  db.collection('songs').insertOne({name: req.body.name, song: req.body.song, thumbUp: 0, thumbDown:0}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/songs/thumbup', (req, res) => {
  db.collection('songs')
  .findOneAndUpdate({name: req.body.name, song: req.body.song}, {
    $inc: {
      thumbUp: +1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.put('/songs/thumbdown', (req, res) => {
  db.collection('songs')
  .findOneAndUpdate({name: req.body.name, song: req.body.song}, {
    $inc: {
      thumbUp: -1
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/songs', (req, res) => {
  db.collection('songs').findOneAndDelete({name: req.body.name, song: req.body.song}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Song deleted!')
  })
})

const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
app.use(express.json())



const uri = process.env.DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function run() {
    try {
        const categoryCollection = client.db('cellSwap').collection('categories')

        app.get('/categories', async (req, res) => {
            const categories = await categoryCollection.find({}).toArray();
            res.send(categories)
        })
        
    }
    finally {
        
    }
}
run()


app.get('/', async (req, res) => {
    res.send('Server is Running')
})

app.listen(port, () => {
    console.log('App is Running on port 5000')
})
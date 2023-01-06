const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())



const uri = process.env.DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function run() {
    try {
        const categoryCollection = client.db('cellSwap').collection('categories')
        const phonesCollection = client.db('cellSwap').collection('phones')
        const usersCollection = client.db('cellSwap').collection('users')
        const bookingsCollection = client.db('cellSwap').collection('bookings')
        const adsCollection = client.db('cellSwap').collection('ads')

        app.get('/categories', async (req, res) => {
            const categories = await categoryCollection.find({}).toArray();
            res.send(categories)
        })

        app.get('/categories/:category', async (req, res) => {
            const query = { category: req.params.category };
            const singleCategory = await categoryCollection.findOne(query)
            res.send(singleCategory)
        })

        app.get('/phones', async (req, res) => {
            const query = {};
            const phones = await phonesCollection.find(query).toArray();
            res.send(phones);
        })

        app.get('/phones/categories/:category', async (req, res) => {
            const category = req.params.category;
            const query = { category: category };
            const phones = await phonesCollection.find(query).toArray();
            res.send(phones)
        })

        app.post('/phones', async (req, res) => {
            const phone = req.body;
            const result = await phonesCollection.insertOne(phone)
            res.send(result);
        })

        app.get('/phones/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const phone = await phonesCollection.findOne(query)
            res.send(phone)
        })

        app.get('/myPhones', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const phones = await phonesCollection.find(query).toArray();
            res.send(phones)
        })

        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email}
            const options = { upsert: true }
            const updateDoc = {
                $set: user
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            const user = await usersCollection.find({}).toArray();
            res.send(user)
        })

        app.get('/users/seller', async (req, res) => {
            const email = req.query.email;
            const user = await usersCollection.findOne({ email })
            if (user?.role === 'Seller') {
               return res.send({isSeller: user?.role === 'Seller'})
            }
        })

        app.get('/users/buyer', async (req, res)=>{
            const email = req.query.email;
            const user = await usersCollection.findOne({ email });
            if (user?.role === 'Buyer') {
                return res.send({isBuyer: user?.role === 'Buyer'})
            }
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result)
        })

        app.put('/ads', async (req, res) => {
            const phone = req.body;
            const email = req.query.email;
            const filter = {email: email }
            const options = { upsert: true };
            const updateDoc = {
                $set: phone
            }
            const result = await adsCollection.updateOne(filter, updateDoc, options)
            res.send(result);
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
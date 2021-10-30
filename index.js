
//tour-planner
//h3jhv3F5EHrutzy2

const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yrluy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db('tour');
        const packageCollection = database.collection('packages');
        // const orderCollection = database.collection('orders');

        //GET Packages API
        app.get('/packages', async (req, res) => {
            const cursor = packageCollection.find({});
            const page = req.query.page;
            const size = parseInt(req.query.size);
            let products;
            const count = await cursor.count();

            if (page) {
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                products = await cursor.toArray();
            }

            res.send({
                count,
                products
            });
        });
        app.post('/packages', async (req, res) => {
            const package = req.body;
            const result = await packageCollection.insertOne(package);
            console.log(result);
            res.json(result)
        })

        // Use POST to get data by keys
        // app.post('/products/byKeys', async (req, res) => {
        //     const keys = req.body;
        //     const query = { key: { $in: keys } }
        //     const products = await productCollection.find(query).toArray();
        //     res.send(products);
        // });

        // // Add Orders API
        // app.post('/orders', async (req, res) => {
        //     const order = req.body;
        //     const result = await orderCollection.insertOne(order);
        //     res.json(result);
        // })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tour planner server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})
const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;


// middleware
// app.use(cors());
// app.use(express.json());

app.use(express.json());
const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};
app.use(cors(corsConfig));

// =================================================================

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ejkwftr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const carCollection = client.db('carDB').collection('car');

    // ----------------------------------------------------------------
    // find all car
    app.get('/cars', async(req, res) => {
        const cursor = carCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });

    // update the car info
    app.get('/cars/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await carCollection.findOne(query);
        res.send(result);
    });

    // add new car
    app.post('/cars', async(req, res) => {
        const newCar = req.body;
        console.log(newCar);
        const result = await carCollection.insertOne(newCar);
        res.send(result);
    });

    // update car information
    app.put('/cars/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = { upsert: true };
        const updatedCar = req.body;
        const car = {
          $set: {
            name: updatedCar.name,
            category: updatedCar.category,
            price: updatedCar.price,
            description: updatedCar.description,
            rating: updatedCar.rating,
            photo: updatedCar.photo,
          },
        };

        const result = await carCollection.updateOne(filter, car, options);
        res.send(result);
    });

    // delete the car from the database
    app.delete('/cars/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await carCollection.deleteOne(query);
        res.send(result);
    });
    // ----------------------------------------------------------------


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// =================================================================


app.get('/', (req, res) => {
    res.send('New car sell running server');
});


app.listen(port, () => {
    console.log(`Car sell running server listening on port ${port}`);
});
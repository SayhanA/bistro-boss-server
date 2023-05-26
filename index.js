const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.User_name}:${process.env.User_password}@cluster0.u2hpa9s.mongodb.net/?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());





// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const foodCollection = client.db('bistroDB').collection('menu');
    const reviewCollection = client.db('bistroDB').collection('reviews');

    app.get('/menu', async (req, res) => {
      const result = await foodCollection.find().toArray();
      res.send(result);
    });

    app.get('/menu/:category', async (req, res) => {
      const  category = req.params.category;
      console.log(req.query);
      const query = { category: category };

      const page = parseInt(req.query.pages) || 0;
      const limit = parseInt(req.query.limit) || 6;
      const skip = page*limit;
      
      const result = await foodCollection.find(query).skip(skip).limit(limit).toArray();
      res.send(result);
    })

    app.get('/reviews', async (req, res) => {
      const result = await foodCollection.find().toArray();
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Welcome to the Bistro Boss');
})

app.listen(port, () => {
  console.log(`Your server is running on PORT: ${port}`)
})

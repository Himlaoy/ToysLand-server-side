const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6ogtg9l.mongodb.net/?retryWrites=true&w=majority`;

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

    const toyCollection = client.db('toyVerseDB').collection('toys')
    const toyAddCollection = client.db('toyVersDB').collection('addToys')

    // toys 
    app.get('/toys/:text', async (req, res) => {
      if (req.params.text == 'Animated character' || req.params.text == 'Disney_princess' || req.params.text == 'Frozen dolls') {

        const result = await toyCollection.find({ subCategory: req.params.text }).toArray()
        return res.send(result)
      }
      const result = await toyCollection.find({}).toArray()

      res.send(result)
    })

    // addToys
    app.post('/addToys', async (req, res)=>{
      const addToys = req.body
      const result = await toyAddCollection.insertOne(addToys)
      res.send(result)
    })

    // myToys
    app.get('/myToys/:email', async(req, res)=>{
       console.log(req.params.email)
       const result = await toyAddCollection.find({Seller_Email:req.params.email}).toArray()
       res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('my assignment eleven is doing good')
})

app.listen(port, () => {
  console.log(`My toy verse is running On port : ${port}`)
})





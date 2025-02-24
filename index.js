require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app=express();
const port= process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.PASSWORD}@cluster0.pqwog.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
    // Send a ping to confirm a successful connection

    const userCollection = client.db("scicTaskDb").collection("userInfo");
    const taskCollection = client.db("scicTaskDb").collection("allTask");

      // add all task
      app.post('/addTask', async (req, res) => {
        const task = req.body;
        const result = await taskCollection.insertOne(task)
        res.send(result)
    })

    // task get
    app.get('/taskCategory/:category', async (req, res) => {
        const category = req.params.category
        const query = { category: category }
        const result = await taskCollection.find(query).toArray()
        res.send(result)
    })

    // task get by email
    app.get('/taskEmail/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email }
        const result = await taskCollection.find(query).toArray()
        res.send(result)
    })

    // delete a task
    app.delete('/tasks/:id', async (req, res) => {
        const id = req.params.id
        const query = { _id: new ObjectId(id) }
        const result = await taskCollection.deleteOne(query)
        res.send(result)
    })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

  
app.get("/",(req,res)=>{
 res.send("Server Running")
})
 

app.listen(port,()=>{console.log(`server is running at port: ${port}`)})
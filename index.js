require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://taskmanager-scic.netlify.app',
    'https://back-end-omega-livid.vercel.app',
  ],
  // methods: "GET, POST, PUT, DELETE, OPTIONS",
  // allowedHeaders: "Content-Type, Authorization",
  credentials: true,
}));

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
    // await client.connect();
    // Send a ping to confirm a successful connection

    const userCollection = client.db("scicTaskDb").collection("userInfo");
    const taskCollection = client.db("scicTaskDb").collection("allTask");


    // userInfo post
    app.post('/users', async (req, res) => {
      const user = req.body;
      // insert email if user dosent exist
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query)
      if (existingUser) {
        return res.send({ message: 'user alrady exists', insertedId: null })
      }
      const result = await userCollection.insertOne(user)
      res.send(result)
    })
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

    //update a task
    app.put('/allTasks/:id', async (req, res) => {
      const id = req.params.id;
      const taskData = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true }
      const updatedTask = {

        // const taskData = { title, description, category: status, time:data.time, updated:time,email:user?.email }

        $set: {
          title: taskData.title,
          description: taskData.description,
          category: taskData.category,
          time: taskData.time,
          email: taskData.email,
          updatedTime: taskData.updated,
        
        }
      }

      const result = await taskCollection.updateOne(filter, updatedTask, options);
      res.send(result)
    })

    // delete a task
    app.delete('/tasks/:id', async (req, res) => {

      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await taskCollection.deleteOne(query)
      res.send(result)
    })



    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Server Running")
})


app.listen(port, () => { console.log(`server is running at port: ${port}`) })
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
    


// Replace the uri string with your connection string.
const uri = "mongodb+srv://ayush:zgdLmJIlN6cJ9Lu5@cluster0.lblotg1.mongodb.net/";
// const uri = "mongodb+srv://ayush:zgdLmJIlN6cJ9Lu5@cluster0.lblotg1.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

// async function run() {
  try {
    const database = client.db('flutter');
    const movies = database.collection('node_js');

    // Query for a movie that has the title 'Back to the Future'
    const query = {  };
    const movie = await movies.find(query).toArray();

    console.log(movie);
    return NextResponse.json({"a":34,movie})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
// run().catch(console.dir);

// }
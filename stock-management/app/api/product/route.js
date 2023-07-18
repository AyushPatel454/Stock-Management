import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// ---> GET API.
export async function GET(request) {
// Replace the uri string with your connection string.
const uri = "mongodb+srv://ayush:zgdLmJIlN6cJ9Lu5@cluster0.lblotg1.mongodb.net/";
const client = new MongoClient(uri);

// async function run() {
  try {
    const database = client.db('stock'); // database name
    const inventory = database.collection('inventory'); // collection name

    // Query for a movie that has the title 'Back to the Future'
    const query = {  };
    const products = await inventory.find(query).toArray();
    return NextResponse.json({success: true, products})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

// ---> POST API.
export async function POST(request) {
// Replace the uri string with your connection string.
let body = await request.json()
console.log(body);
const uri = "mongodb+srv://ayush:zgdLmJIlN6cJ9Lu5@cluster0.lblotg1.mongodb.net/";
const client = new MongoClient(uri);

  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const product = await inventory.insertOne(body)
    return NextResponse.json({product, ok: true})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

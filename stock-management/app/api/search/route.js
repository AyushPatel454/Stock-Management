import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// ---> GET API.
export async function GET(request) {
    const query = request.nextUrl.searchParams.get("query");
// Replace the uri string with your connection string.
const uri = "mongodb+srv://ayush:zgdLmJIlN6cJ9Lu5@cluster0.lblotg1.mongodb.net/";
const client = new MongoClient(uri);

// async function run() {
  try {
    const database = client.db('stock'); // database name
    const inventory = database.collection('inventory'); // collection name
    
    const products = await inventory.aggregate([
        {
          $match: {
            $or: [
              { slug: { $regex: query, $options: "i" } }, // Partial matching for name field.
            //   { quantity: { $regex: query, $options: "i" } },
            //   { price: { $regex: query, $options: "i" } }
            ]
          }
        }
    ]).toArray();
    return NextResponse.json({success: true, products})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}



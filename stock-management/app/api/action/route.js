import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// ---> POST API.
export async function POST(request) {
    // Replace the uri string with your connection string.
    let {action, slug, initialQuantity} = await request.json()


    // let body = await request.json()
    // console.log(body);
    
    const uri = "mongodb+srv://ayush:zgdLmJIlN6cJ9Lu5@cluster0.lblotg1.mongodb.net/";
    const client = new MongoClient(uri);
    
    try {
        const database = client.db('stock'); // database name
        const inventory = database.collection('inventory'); // collection name

        // create a filter for a movie to update
        const filter = { slug: slug };
    
        let newQuantity = action=="plus"? (parseInt(initialQuantity) + 1) : (parseInt(initialQuantity) -1)
    
        // create a document that sets the plot of the movie
        const updateDoc = {
          $set: {
            quantity: newQuantity
          },
        };
    
        const result = await inventory.updateOne(filter, updateDoc, {});
        // console.log(
        //     `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
        // )
        return NextResponse.json({success: true, message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`})
    
      } finally {
    
        await client.close();
    
      }
    }
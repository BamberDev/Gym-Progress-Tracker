import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { auth } from "@clerk/nextjs/server";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri as string);

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await client.connect();
    const database = client.db("gym-progress");
    const groups = database.collection("groups");

    const result = await groups.find({ userId }).toArray();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const group = await request.json();
    group.userId = userId;

    if (!group.name || !group.description) {
      return NextResponse.json(
        { error: "Invalid group data" },
        { status: 400 }
      );
    }

    await client.connect();
    const database = client.db("gym-progress");
    const groups = database.collection("groups");

    const result = await groups.insertOne(group);
    return NextResponse.json({ ...group, _id: result.insertedId });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

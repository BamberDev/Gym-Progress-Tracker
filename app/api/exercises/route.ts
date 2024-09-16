import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { auth, currentUser } from "@clerk/nextjs/server";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri as string);

export async function GET(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");

    await client.connect();
    const database = client.db("gym-progress");
    const exercises = database.collection("exercises");

    const query = groupId ? { userId, groupId } : { userId };
    const result = await exercises.find(query).toArray();
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

    const user = await currentUser();
    const exercise = await request.json();
    exercise.userId = userId;
    exercise.userName = `${user?.firstName} ${user?.lastName}`;

    if (
      !exercise.name ||
      !exercise.groupId ||
      !Array.isArray(exercise.sets) ||
      exercise.sets.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid exercise data", receivedData: exercise },
        { status: 400 }
      );
    }

    await client.connect();
    const database = client.db("gym-progress");
    const exercises = database.collection("exercises");

    const result = await exercises.insertOne(exercise);
    return NextResponse.json({ ...exercise, _id: result.insertedId });
  } catch (error) {
    console.error("Error creating exercise:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { auth } from "@clerk/nextjs/server";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri as string);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await client.connect();
    const database = client.db("gym-progress");
    const groups = database.collection("groups");

    const group = await groups.findOne({ _id: new ObjectId(id), userId });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const group = await request.json();
    const { id } = params;

    await client.connect();
    const database = client.db("gym-progress");
    const groups = database.collection("groups");

    const updateFields = { ...group };
    delete updateFields._id;

    const result = await groups.updateOne(
      { _id: new ObjectId(id), userId },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const updatedGroup = await groups.findOne({
      _id: new ObjectId(id),
      userId,
    });

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error("Error updating group:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await client.connect();
    const database = client.db("gym-progress");
    const groups = database.collection("groups");
    const exercises = database.collection("exercises");

    const result = await groups.deleteOne({ _id: new ObjectId(id), userId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    await exercises.deleteMany({ groupId: id, userId });

    return NextResponse.json({
      message: "Group and associated exercises deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

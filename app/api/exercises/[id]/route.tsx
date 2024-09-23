import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { auth } from "@clerk/nextjs/server";
import { serverExerciseSchema } from "@/utils/zodSchema";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri as string);

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const exercise = await request.json();
    const { id } = params;

    const validation = serverExerciseSchema.safeParse(exercise);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid exercise data", errors: validation.error.format() },
        { status: 400 }
      );
    }

    await client.connect();
    const database = client.db("gym-progress");
    const exercises = database.collection("exercises");

    const updateFields = { ...exercise };
    delete updateFields._id;

    const result = await exercises.updateOne(
      { _id: new ObjectId(id), userId },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    const updatedExercise = await exercises.findOne({
      _id: new ObjectId(id),
      userId,
    });

    return NextResponse.json(updatedExercise);
  } catch (error) {
    console.error("Error updating exercise:", error);
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
    const exercises = database.collection("exercises");

    const result = await exercises.deleteOne({ _id: new ObjectId(id), userId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Exercise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Exercise deleted successfully" });
  } catch (error) {
    console.error("Error deleting exercise:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

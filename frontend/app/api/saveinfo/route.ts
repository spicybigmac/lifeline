import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB_NAME = "profiledata";
const COLLECTION_NAME = "terrahacks";

export async function POST(req: NextRequest) {
    try {
        const { username, ...profileData } = await req.json();

        if (!username) {
        return NextResponse.json({ message: 'Username is required.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const profilesCollection = db.collection(COLLECTION_NAME);

        const result = await profilesCollection.updateOne(
        { username: username },
        { $set: { ...profileData, username } },
        { upsert: true }
        );

        return NextResponse.json({ message: 'Profile saved successfully.', result }, { status: 200 });

    } catch (error) {
        console.error("Error saving profile:", error);
        return NextResponse.json({ message: 'An error occurred while saving the profile.' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ message: 'Username query parameter is required.' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const profilesCollection = db.collection(COLLECTION_NAME);

    const profile = await profilesCollection.findOne({ username: username });

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found.' }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });

  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ message: 'An error occurred while fetching the profile.' }, { status: 500 });
  }
}
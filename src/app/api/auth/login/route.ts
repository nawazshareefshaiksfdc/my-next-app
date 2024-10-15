import { dbConnect } from '@/app/lib/db';
import User from "@/app/Models/userModal";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // Use bcrypt to hash and compare passwords

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // If login is successful, return a success response
    return NextResponse.json({ message: "Login successful!" }, { status: 200 });
  } catch (_error) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

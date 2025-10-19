import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await axios.post("http://localhost:3000/api/jobs/addJob", body, {
      withCredentials: true,
    });

    return NextResponse.json(res.data);
  } catch (err: any) {
    console.error("Error adding job:", err.response?.data || err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

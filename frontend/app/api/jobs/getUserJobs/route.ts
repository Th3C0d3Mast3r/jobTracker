import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const res = await axios.get("http://localhost:3000/api/jobs/getUserJobs", {
      withCredentials: true,
    });

    return NextResponse.json(res.data);
  } catch (err:any) {
    console.error("Error fetching user jobs:", err.response?.data || err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

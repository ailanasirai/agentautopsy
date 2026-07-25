import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trace, analysis } = body;

    if (!trace || !analysis) {
      return NextResponse.json(
        { error: "Missing trace or analysis data." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("reports")
      .insert({
        agent_name: trace.agent_name,
        framework: trace.framework,
        trace_data: trace,
        analysis_result: analysis,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save report." },
        { status: 500 }
      );
    }

    return NextResponse.json({ shareId: data.id });
  } catch (err) {
    console.error("Share route error:", err);
    return NextResponse.json(
      { error: "Something went wrong while saving the report." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    return NextResponse.json({
      trace: data.trace_data,
      analysis: data.analysis_result,
      created_at: data.created_at,
    });
  } catch (err) {
    console.error("Share GET error:", err);
    return NextResponse.json(
      { error: "Something went wrong while fetching the report." },
      { status: 500 }
    );
  }
}

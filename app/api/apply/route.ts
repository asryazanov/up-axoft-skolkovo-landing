import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();

  return NextResponse.json({
    ok: true,
    mode: "mock",
    message: "Заявка принята в локальную заглушку. Bitrix24 будет подключён после получения webhook/API.",
    received: {
      type: payload.type,
      company: payload.company,
      email: payload.email,
      industry: payload.industry,
      utm: payload.utm ?? null
    }
  });
}

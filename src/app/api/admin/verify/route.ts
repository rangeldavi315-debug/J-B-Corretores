import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const passcode = request.headers.get("x-admin-passcode");
  
  if (!process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: "ADMIN_PASSCODE não configurado no servidor." }, { status: 500 });
  }

  if (passcode === process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Chave de acesso incorreta." }, { status: 401 });
}

import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

export async function POST(request: Request) {
  const passcode = request.headers.get("x-admin-passcode");
  if (passcode !== process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ensure this only runs in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Git operations are only available in local development mode." }, { status: 403 });
  }

  try {
    const cwd = process.cwd();
    
    // 1. Check if git is installed and it's a repo
    try {
      await execAsync("git rev-parse --is-inside-work-tree", { cwd });
    } catch {
      return NextResponse.json({ error: "Not a Git repository or Git is not installed." }, { status: 400 });
    }

    // 2. Check for any changes in the whole repository — this button publishes
    // the entire project (code + content), not just the admin-edited content.
    const { stdout: statusOut } = await execAsync("git status --porcelain", { cwd });
    if (!statusOut.trim()) {
      return NextResponse.json({ error: "Não existem alterações para publicar." }, { status: 400 });
    }

    // 3. Validate JSON files before commit (sanity check) — never publish a corrupted file
    for (const file of ["properties.json", "testimonials.json"]) {
      try {
        const data = await fs.readFile(path.join(cwd, "content", file), "utf-8");
        JSON.parse(data); // throws if invalid
      } catch {
        return NextResponse.json({ error: `O arquivo ${file} contém erros de formatação. Cancele e salve novamente.` }, { status: 400 });
      }
    }

    // 4. Stage everything in the working tree (respects .gitignore)
    await execAsync("git add -A", { cwd });

    // 5. Commit
    const message = `publish: update site via admin - ${new Date().toISOString()}`;
    await execAsync(`git commit -m "${message}"`, { cwd });

    // 6. Push
    // This relies on the local environment having git credentials cached/configured
    try {
      await execAsync("git push", { cwd });
    } catch (pushErr: unknown) {
      // Revert commit if push fails (optional, but good for cleanliness)
      console.error("Git Push Error:", pushErr);
      const message = pushErr instanceof Error ? pushErr.message : String(pushErr);
      return NextResponse.json({
        error: "Erro ao fazer push para o GitHub. Verifique suas credenciais Git locais. " + message
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Publicado com sucesso no GitHub!" });
  } catch (error: unknown) {
    console.error("Git Operation Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Erro na operação git: ${message}` }, { status: 500 });
  }
}

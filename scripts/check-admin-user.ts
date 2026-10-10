/** Read-only: checks the admin allow-list against Firebase Auth users. Run: npx tsx --env-file=.env.local scripts/check-admin-user.ts */
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const raw = process.env.FIREBASE_SERVICE_ACCOUNT!;
const json = JSON.parse(raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8"));
initializeApp({ credential: cert({ ...json, private_key: String(json.private_key).replace(/\\n/g, "\n") }) });

async function main() {
  const allowed = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  console.log("project:", json.project_id, "| client project id:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log("ADMIN_EMAILS (" + allowed.length + "):", allowed.map((e) => JSON.stringify(e)).join(", "));
  const users = await getAuth().listUsers(100);
  console.log(`Firebase Auth users (${users.users.length}):`);
  for (const u of users.users) {
    const email = (u.email ?? "").toLowerCase();
    console.log(
      `  ${JSON.stringify(u.email)}  disabled=${u.disabled}  verified=${u.emailVerified}  providers=${u.providerData.map((p) => p.providerId).join("+") || "none"}  lastSignIn=${u.metadata.lastSignInTime ?? "never"}  inAllowList=${allowed.includes(email)}`,
    );
  }
  for (const a of allowed) if (!users.users.some((u) => (u.email ?? "").toLowerCase() === a)) console.log(`  !! allow-listed ${JSON.stringify(a)} has NO Firebase user`);
}
main().catch((e) => console.error("FAILED:", e.message));

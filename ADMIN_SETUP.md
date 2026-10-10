# Site editor (/admin) setup

The owner edits the site at `/admin`: projects and photos, home page text, services, reviews, business
details, contact page and bottom banner. Everything has **Revert to original**, and **Version history**
can undo any change.

## How it works

- **The original site is code.** `lib/content.ts` (with `lib/site.ts` and `lib/projects.ts`) is the
  site exactly as delivered. The owner can never change it.
- **Edits are an overlay in Firestore** (`site/content`, one field per section). A section with no edit
  shows the original. "Revert to original" deletes that section's edit; "Revert whole site" deletes them all.
- **Every save/revert first snapshots the previous state** (`site_history`, last 40). "Undo this change"
  restores the snapshot.
- **Whatever is saved is re-validated on save and on read** (`lib/content-validate.ts`): unknown fields
  dropped, text length-capped, image URLs limited to the site's own `/work/` folder or this Cloudinary account.
  Invalid data falls back to the original, so a bad edit cannot break a public page.
- **Photos** are shrunk in the owner's browser to WebP under 100KB, then uploaded straight to Cloudinary
  (`mb-plumber/projects`).
- **Login** is Firebase email + password. The server turns the sign-in into an httpOnly session cookie and
  only lets in emails listed in `ADMIN_EMAILS`.

## One-off setup

1. **Firebase project** (console.firebase.google.com): create one (e.g. `mb-plumber`). No Analytics needed.
2. **Authentication** > Sign-in method > enable **Email/Password**. Under Users, add the owner's email and
   a temporary password (they can use "Forgot your password?" on the login screen to set their own).
3. **Firestore Database** > create database (production mode, region `eur3` or `europe-west2`). Then
   Rules > paste `firestore.rules` > Publish (blocks all browser access; the server bypasses it).
4. **Web app**: Project settings > Your apps > add a Web app. Copy `apiKey`, `authDomain`, `projectId`,
   `appId` into the four `NEXT_PUBLIC_FIREBASE_*` variables.
5. **Service account**: Project settings > Service accounts > Generate new private key. Put the JSON (or its
   base64) in `FIREBASE_SERVICE_ACCOUNT`. Treat it as a password.
6. `ADMIN_EMAILS` = the owner's login email (comma-separate for more than one person).
7. Add all of the above in **Vercel > Project > Settings > Environment Variables** (Production), plus the
   existing `CLOUDINARY_*` ones, then redeploy. Locally, put them in `.env.local`.
8. In Firebase Authentication > Settings > **Authorized domains**, add the live domain
   (`www.mbplumber.co.uk`, and `mbplumber.vercel.app` while testing).

Until steps 1-7 are done, `/admin` shows a "not set up yet" notice and the public site simply shows the
original content.

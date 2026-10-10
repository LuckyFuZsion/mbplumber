import { getContent } from "@/lib/content-server";
import { SITE } from "@/lib/site";

export const revalidate = 300;

/** A short plain-text summary of the site for AI assistants (https://llmstxt.org). Built from the live content. */
export async function GET() {
  const { business, services, projects, faq } = await getContent();
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${business.tagline}. ${business.yearsExperience} years of experience. ${business.area}.`,
    "",
    "MB Plumber is a local plumber and bathroom fitter based in Grantham, Lincolnshire. Bathroom fitting is the main service. MB Plumber does not carry out work on gas boilers, which must be done by a Gas Safe registered engineer.",
    "",
    "## Pages",
    `- [Home](${SITE.url}/): overview and recent work`,
    `- [Services](${SITE.url}/services): ${services.items.map((s) => s.title).join(", ")}`,
    `- [Completed work](${SITE.url}/projects): ${projects.items.length} finished projects with photos`,
    `- [Gallery](${SITE.url}/gallery): photos of recent jobs`,
    `- [Reviews](${SITE.url}/reviews): genuine customer reviews`,
    `- [Contact](${SITE.url}/contact): request a free quote`,
    "",
    "## Contact",
    `- Phone: ${business.phone}`,
    `- Email: ${business.email}`,
    `- Area: ${business.area}`,
    "",
    "## Common questions",
    ...faq.items.map((f) => `- ${f.q} ${f.a}`),
    "",
    "## Permissions",
    "Public pages may be read and quoted with attribution to MB Plumber. The /admin area is private.",
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

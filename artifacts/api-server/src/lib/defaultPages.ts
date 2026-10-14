import { UpdateWebsitePagesBody } from "@workspace/api-zod";

function page(
  slug: string, eyebrow: string, title: string, description: string,
  sections: { title: string; body: string }[],
) {
  return { slug, eyebrow, title, description, seoTitle: `${title} | Star Bound`, seoDescription: description.slice(0, 200), imagePath: null, sections };
}

export const defaultPages = UpdateWebsitePagesBody.parse({
  pages: [
    page("features", "Proprietary Vision AI & Celestial Mapping", "Every freckle is a star. Every body is a galaxy.",
      "Explore how Star Bound transforms natural skin markings, beauty marks, and freckles into high-precision astronomical constellation maps.",
      [
        { title: "Real-Time Neural Vision", body: "On-device computer vision isolates freckle coordinates with sub-millimeter precision. Zero photo data leaves the user's phone." },
        { title: "Astronomical IAU Star Matching", body: "Maps your unique skin geometry against 88 official constellations and deep-space celestial charts." },
        { title: "The Constellation Vault", body: "Track and trace seasonal changes in your skin patterns, unlocking ancient astronomical lore and personalized mythos." },
        { title: "Physical Celestial Jewelry", body: "Export your personalized star maps into laser-etched sterling silver pendants and fine-art cosmic prints." },
      ]),
    page("about", "Human Biology Meets the Cosmos", "Reconnecting humanity with personal astronomy.",
      "Star Bound was born at the intersection of computer vision, ancient astronomical lore, and personal identity.",
      [
        { title: "The Origin", body: "People have looked at constellations in the night sky for millennia. Star Bound brings that celestial wonder inward to our own bodies." },
        { title: "Privacy-First Vision", body: "We believe intimate personal biometric data should never be monetized or sent to external servers. All neural detection runs locally on your device." },
        { title: "Consumer Virality", body: "With organic momentum across TikTok and Instagram, Star Bound transforms personal self-expression into an interactive cosmic journey." },
      ]),
    page("pricing", "Consumer Tiers & Bespoke Goods", "Transparent pricing for cosmic exploration.",
      "Start exploring your personal star map for free, unlock unlimited scans with Star Bound Plus, or commission custom celestial jewelry.",
      [
        { title: "Free Cosmic Tier", body: "3 free on-device freckle scans, single constellation matching, and watermarked social export presets with near-zero CAC." },
        { title: "Star Bound Plus (£4.99/mo)", body: "Unlimited scans, multi-body constellation stitching, seasonal skin tracking, and access to the complete astrological lore library." },
        { title: "Custom Celestial Goods (£35 - £85)", body: "Laser-engraved silver and gold star pendants, archival museum-grade framed prints, and bespoke celestial gifts." },
      ]),
    page("faq", "Common Questions", "Everything you need to know about Star Bound.",
      "Answers to frequent questions about privacy, camera scanning, star matching, and orders.",
      [
        { title: "How does Star Bound detect constellations?", body: "Our on-device vision neural network detects skin contrast points (freckles, moles, beauty marks) and computes angular distances matching real celestial geometry." },
        { title: "Are my photos sent to your servers?", body: "Never. All image processing and coordinate extraction happens 100% on your device. Only anonymized coordinate metadata is stored if you choose to sync your account." },
        { title: "How accurate is the star matching?", body: "We cross-reference coordinates against the International Astronomical Union (IAU) star catalog containing over 100,000 celestial objects." },
        { title: "Can I order jewelry with my constellation?", body: "Yes, you can export any captured constellation directly to our zero-inventory custom jewelry workshop." },
      ]),
    page("contact", "Start a conversation", "Connect with the Star Bound team.",
      "Request pitch materials, investor data, or send a question about Star Bound. Your enquiry goes to our protected website inbox.",
      [
        { title: "Investor & Partnership Enquiries", body: "We are actively speaking with seed-stage consumer tech and AI funds interested in our viral on-device vision technology." },
        { title: "Media & Creator Collabs", body: "Reach out if you are a creator, influencer, or journalist looking for early access and product demos." },
      ]),
    page("privacy", "Website data handling", "Privacy notice",
      "How this website handles contact enquiries and administrator access. This notice covers the website, not any separately agreed product service.",
      [
        { title: "Information you submit", body: "The contact form collects your name, email address, optional company, enquiry type, message and confirmation that you have read this notice. These details are stored in the website database and made available only through the protected administrator inbox." },
        { title: "How enquiries are used", body: "Your details allow an approved administrator to review your enquiry and respond to it. Submitting this form does not subscribe you to marketing or create a product account. Do not send sensitive personal information or confidential operational data." },
        { title: "Access and technical safeguards", body: "Administrator access uses authentication and an approved email allowlist. Authentication uses session cookies. To limit contact-form abuse, the server stores short-lived request counters identified by a hashed network address; it does not add your raw network address to an enquiry." },
        { title: "Privacy requests", body: "Use the contact form to ask about your enquiry data or request its deletion. Administrators can delete enquiries from the protected inbox. Applicable UK data protection rights may include access, correction, erasure and the right to raise concerns with the Information Commissioner's Office (ICO)." },
        { title: "Details to confirm before launch", body: "The website operator must confirm its legal identity, data protection contact, lawful basis, retention period, hosting providers and any international transfer arrangements before collecting live enquiries. No unverified company address, registration number or retention promise is stated here. This notice needs the operator's review before public use." },
      ]),
    page("terms", "Website information", "Website terms",
      "These terms explain the informational purpose of the Star Bound website. Product and commercial arrangements must be agreed separately.",
      [
        { title: "An introduction, not a contract", body: "Website copy and screenshots introduce Star Bound's intended product experience. Example dashboard figures are illustrative. They are not a guarantee of results, availability or service levels." },
        { title: "Pricing and enquiries", body: "Pricing is provided by quotation in GBP (£). Sending a contact or pricing enquiry does not create an order, subscription or obligation to pay. Scope, taxes and commercial terms must be confirmed in a separate written agreement." },
        { title: "Using the website", body: "Use the website and contact form for genuine enquiries. Do not attempt unauthorised access, disrupt the service or submit harmful or unlawful content. Do not include passwords or confidential datasets in a message." },
        { title: "Your rights", body: "Nothing on this website is intended to remove rights you have under applicable law. Questions about website information can be sent through the contact form." },
        { title: "Details to confirm before launch", body: "The website operator must confirm its legal identity, contact details and final legal terms before public use. These informational terms do not invent a registered address, company number, governing-law clause or product service agreement. Operator and legal review are needed before relying on them." },
      ]),
  ],
});
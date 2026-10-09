import { UpdateWebsitePagesBody } from "@workspace/api-zod";

function page(
  slug: string, eyebrow: string, title: string, description: string,
  sections: { title: string; body: string }[],
) {
  return { slug, eyebrow, title, description, seoTitle: `${title} | Star Bound`, seoDescription: description.slice(0, 200), imagePath: null, sections };
}

export const defaultPages = UpdateWebsitePagesBody.parse({
  pages: [
    page("features", "A clearer view of AI operations", "Understand your AI teams at a glance.",
      "Explore how Star Bound brings model teams, quality scans and reporting into one workspace for UK organisations.",
      [
        { title: "Model teams, together", body: "See your model teams in one place. Bring operational context together so it is easier to understand what is running and where attention is needed." },
        { title: "Quality scans", body: "Review quality scans alongside your team's work. Use the product tour to explore how scan results can support clearer operational decisions." },
        { title: "Reports and visibility", body: "Make operational information easier to follow and share. Explore reporting views that help teams explain their work without switching between disconnected screens." },
        { title: "Explore the product", body: "The website shows the intended product experience. Dashboard figures in screenshots are examples, not customer results. Request a demo to discuss your use case and current availability." },
      ]),
    page("about", "Designed with UK teams in mind", "Clearer operations. Better understanding.",
      "Star Bound is focused on making AI operations understandable for the people managing model teams, reviewing quality and communicating progress.",
      [
        { title: "Why Star Bound", body: "AI operations can be difficult to explain when information is spread across different tools. Star Bound brings model teams, quality scans and reporting into a clear, shared view." },
        { title: "A practical product conversation", body: "This website introduces the product and its intended workflow. We welcome conversations with UK teams and prospective partners about their operational needs." },
        { title: "No inflated claims", body: "Illustrative screenshots show example data. They do not represent customer traction or verified performance results. Ask for a demo to understand the product and discuss what is available for your organisation." },
      ]),
    page("pricing", "Quoted for your requirements", "A quote that fits your team.",
      "Tell us about your organisation and intended use. Star Bound pricing is provided by quotation in GBP (£), rather than invented package prices.",
      [
        { title: "Talk through your scope", body: "Share your team size, operational workflow and any support or onboarding requirements. These details help frame a useful pricing conversation." },
        { title: "Clear GBP quotations", body: "Request a written quote in pounds sterling (£). Your quote should set out its scope, any applicable taxes, payment terms and what is included before you agree to proceed." },
        { title: "No checkout commitment", body: "Sending a pricing enquiry does not create an order, subscription or payment obligation. Availability and commercial terms are confirmed separately." },
      ]),
    page("faq", "Questions, answered", "Get to know Star Bound.",
      "Answers to common questions about the website, product tour and next steps for UK organisations.",
      [
        { title: "What is Star Bound?", body: "Star Bound is an AI operations workspace bringing model teams, quality scans and team visibility into one understandable view." },
        { title: "Are the dashboard numbers real customer results?", body: "No. Dashboard screenshots contain illustrative example data, not customer results or claims of traction." },
        { title: "How can I see the product?", body: "Use the contact form to request a demo. Tell us about the workflow you would like to explore so the conversation is relevant to your team." },
        { title: "How much does it cost?", body: "Pricing is quote-based in GBP (£). Send a pricing enquiry with your requirements; no published fixed rates or packages are implied." },
        { title: "Does sending an enquiry sign me up?", body: "No. The contact form sends an enquiry to the website's protected admin inbox. It does not create a product account or subscription." },
        { title: "How do I ask about security or data handling?", body: "Use the contact form for questions about your intended use. Product-specific security, hosting and contractual requirements must be confirmed before sharing sensitive operational data." },
      ]),
    page("contact", "Start a conversation", "Tell us what your team needs.",
      "Request a demo, ask for a GBP (£) quote, or send a question about Star Bound. Your enquiry goes to our protected website inbox.",
      [
        { title: "Make it relevant to your team", body: "Tell us about your organisation and the workflow you want to explore. Please do not include passwords, confidential datasets or sensitive personal information." },
        { title: "What happens next", body: "Once your enquiry is saved, the form confirms receipt. An approved website administrator can review it and reply using the email address you provide." },
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
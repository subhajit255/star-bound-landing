import Link from 'next/link';
import { loadSiteContent } from '../lib/server-content';
import { SiteFooter, SiteNav } from './site-chrome';
import styles from './legal-page.module.css';

type Section = { title: string; text: string };

const notices: Record<'privacy' | 'terms', { title: string; introduction: string; sections: Section[] }> = {
  privacy: {
    title: 'Privacy policy',
    introduction: 'This notice describes personal information used by the Star Bound investor-facing website. It does not cover a future AI application or a separately contracted service.',
    sections: [
      { title: 'Information we process', text: 'Browsing the website may generate technical request and security logs. Authorised administrators who sign in provide account information, such as an identifier, email address and profile details, through the sign-in provider. Website edits and uploaded images are stored to operate the content-management system.' },
      { title: 'How information is used', text: 'Information is used to operate the website, authenticate authorised administrators, manage website content and investigate security or technical issues. Depending on the activity, the applicable legal basis may be legitimate interests in operating a secure website, consent where required, or a legal obligation. These bases must be confirmed by the website operator before this draft becomes a final policy.' },
      { title: 'Cookies and sign-in', text: 'The administrator sign-in flow uses cookies to maintain a session and protect the authentication process. The website does not currently implement its own advertising or optional analytics cookies. Hosting and sign-in providers may also process technical information under their own privacy notices.' },
      { title: 'Service providers', text: 'The website uses Replit hosting, authentication, PostgreSQL database services and App Storage for uploaded files. These services process information needed to deliver the website. The operator must confirm the relevant provider agreements, processing locations and any international-transfer safeguards before publishing a final notice.' },
      { title: 'Retention and security', text: 'Information should be kept only as long as needed for its stated purpose, security or applicable legal obligations. Administrator sessions expire, and access to editing and uploading is restricted to approved accounts. No online service can guarantee absolute security. The operator must confirm retention periods for accounts, logs and uploaded content.' },
      { title: 'Your rights', text: 'Depending on the circumstances, UK data protection law gives you rights to access, correct or erase personal information, restrict or object to processing, request portability and withdraw consent where processing relies on consent. You may raise a concern with the Information Commissioner’s Office at ico.org.uk.' },
      { title: 'Privacy enquiries', text: 'For questions about personal information, contact the website operator through the contact details supplied directly to you. The operator’s legal identity and dedicated privacy contact details must be confirmed and included before this draft is used as a final privacy notice.' },
    ],
  },
  terms: {
    title: 'Terms & conditions',
    introduction: 'These website terms explain the permitted use of the Star Bound investor-facing website. They are not subscription terms or a contract for an AI product.',
    sections: [
      { title: 'Using this website', text: 'Use this website lawfully and do not interfere with its operation, attempt unauthorised access, upload malicious material or misuse administrator accounts. Access to website editing is limited to approved administrators.' },
      { title: 'Website information', text: 'Product descriptions, demonstrations and screenshots are provided for general information. They do not guarantee that a particular feature is available, constitute investment advice or create an offer to provide a paid service. Confirm requirements and availability directly before relying on them.' },
      { title: 'Intellectual property', text: 'Website text, branding, designs and product materials may be protected by intellectual-property rights. You may view the website for personal or internal evaluation. Further reproduction or commercial use requires permission from the relevant rights holder, except where applicable law permits otherwise.' },
      { title: 'Prices and services', text: 'Where monetary amounts are shown, they are expressed in pounds sterling (£) unless clearly stated otherwise. Any future service, subscription, investment or commercial arrangement requires separate agreed terms. This website does not itself create a purchase or subscription agreement.' },
      { title: 'External services and links', text: 'Links to external services are provided for convenience. Those services have their own terms and privacy notices. Their availability and content are not controlled by this website.' },
      { title: 'Availability and responsibility', text: 'The website may be updated, interrupted or unavailable. Take appropriate steps to check information before relying on it. Nothing in these terms is intended to exclude rights or liabilities that cannot lawfully be excluded, including applicable statutory consumer rights.' },
      { title: 'Privacy and changes', text: 'Read the privacy policy for information about the website’s use of personal information. These terms may be updated as the website changes. The website operator’s legal identity, contact details and applicable jurisdiction must be confirmed before this draft is adopted as final terms.' },
    ],
  },
};

export async function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const { brandName } = await loadSiteContent();
  const notice = notices[kind];
  return (
    <div className={styles.page}>
      <SiteNav brand={brandName} cta="Back to website" ctaHref="/" />
      <main className={`wrap ${styles.main}`}>
        <Link href="/" className={styles.back}>← Back to {brandName}</Link>
        <p className={styles.label}>Website information</p>
        <h1>{notice.title}</h1>
        <p className={styles.introduction}>{notice.introduction}</p>
        <aside className={styles.draft} aria-label="Draft notice">
          <strong>Draft for review.</strong> Business identity, contact details and applicable legal
          requirements need confirmation before this document is adopted as a final notice.
        </aside>
        <article className={styles.article}>
          {notice.sections.map((section, index) => (
            <section key={section.title}>
              <h2>{index + 1}. {section.title}</h2>
              <p>{section.text}</p>
            </section>
          ))}
        </article>
        <nav className={styles.related} aria-label="Related legal page">
          <Link href={kind === 'privacy' ? '/terms' : '/privacy'}>
            {kind === 'privacy' ? 'Read the terms & conditions' : 'Read the privacy policy'}
          </Link>
        </nav>
      </main>
      <SiteFooter brand={brandName} />
    </div>
  );
}
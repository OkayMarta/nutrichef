import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUp, ShieldCheck } from "lucide-react";
import "./LegalPage.scss";

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="legal-page container">
            <div className="legal-page__container">
                {/* Back to Home Navigation */}
                <div className="legal-page__back-nav">
                    <Link to="/" className="legal-page__back-link">
                        <ArrowLeft size={16} />
                        <span>Back to Home</span>
                    </Link>
                </div>

                {/* Header */}
                <header className="legal-page__header">
                    <span className="legal-page__badge">
                        Last updated: September 12, 2026
                    </span>
                    <h1 className="legal-page__title">Privacy Policy</h1>
                    <p className="legal-page__subtitle">
                        This Privacy Policy describes Our policies and
                        procedures on the collection, use, and disclosure of
                        Your information when You use NutriChef.
                    </p>
                </header>

                {/* Google OAuth & Data Privacy Commitment Callout */}
                <div className="legal-page__callout">
                    <div className="legal-page__callout-header">
                        <ShieldCheck size={20} color="#469c3c" />
                        <h3>
                            Our Commitment to Your Privacy &amp; Google Data
                        </h3>
                    </div>
                    <p>
                        When you authenticate using Google Sign-In, NutriChef
                        only accesses your basic public profile details (name
                        and verified email address) to create and identify your
                        account.
                    </p>
                    <p>
                        <strong>
                            We never sell, rent, monetize, or share your Google
                            user data or recipe entries with third-party
                            advertisers or data brokers.
                        </strong>{" "}
                        Session tokens are securely stored in your browser
                        solely to maintain your authenticated session.
                    </p>
                </div>

                {/* Main Content */}
                <article className="legal-page__content">
                    <p>
                        We use Your Personal Data to provide and improve the
                        Service. We collect, use, and disclose Your information
                        as described in this Privacy Policy and, where required
                        by applicable law, only where We have a valid legal
                        basis to do so, including Your consent.
                    </p>

                    <h2>1. Interpretation and Definitions</h2>
                    <h3>Interpretation</h3>
                    <p>
                        The words of which the initial letter is capitalized
                        have meanings defined under the following conditions.
                        The following definitions shall have the same meaning
                        regardless of whether they appear in singular or in
                        plural.
                    </p>

                    <h3>Definitions</h3>
                    <ul>
                        <li>
                            <strong>Account:</strong> A unique account created
                            for You to access Our Service or parts of Our
                            Service.
                        </li>
                        <li>
                            <strong>Company:</strong> (referred to as either
                            &quot;the Company&quot;, &quot;We&quot;,
                            &quot;Us&quot; or &quot;Our&quot; in this Agreement)
                            refers to NutriChef.
                        </li>
                        <li>
                            <strong>Cookies:</strong> Small files placed on Your
                            device containing details of Your session and usage.
                        </li>
                        <li>
                            <strong>Country/State:</strong> Refers to Ukraine.
                        </li>
                        <li>
                            <strong>Device:</strong> Any digital device that can
                            access the Service, such as a computer, mobile
                            phone, or tablet.
                        </li>
                        <li>
                            <strong>Personal Data:</strong> Any information that
                            relates to an identified or identifiable individual
                            (such as name and email address).
                        </li>
                        <li>
                            <strong>Service:</strong> Refers to the NutriChef
                            web application accessible at{" "}
                            <a
                                href="https://nutrichef-ten.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                https://nutrichef-ten.vercel.app
                            </a>
                            .
                        </li>
                        <li>
                            <strong>Usage Data:</strong> Data collected
                            automatically, generated by the use of the Service
                            (e.g., page visit durations, browser type).
                        </li>
                        <li>
                            <strong>You:</strong> The individual accessing or
                            using the Service.
                        </li>
                    </ul>

                    <h2>2. Collecting and Using Your Personal Information</h2>
                    <h3>Types of Data Collected</h3>
                    <p>
                        <strong>Personal Data:</strong> While using Our Service,
                        We may ask You to provide Us with certain personally
                        identifiable information, including:
                    </p>
                    <ul>
                        <li>Email address</li>
                        <li>First name and last name</li>
                    </ul>

                    <p>
                        <strong>Usage Data:</strong> Collected automatically
                        when using the Service, including Internet Protocol (IP)
                        address, browser type, pages visited, time and date of
                        visit, diagnostic data, and mobile device identifiers.
                    </p>

                    <h3>Tracking Technologies and Cookies</h3>
                    <p>
                        We use necessary session cookies and local browser
                        storage to facilitate authentication and maintain
                        logged-in sessions:
                    </p>
                    <ul>
                        <li>
                            <strong>Necessary / Essential Cookies:</strong>{" "}
                            Session-based tokens essential to authenticate users
                            and prevent unauthorized access.
                        </li>
                        <li>
                            <strong>Functionality Cookies:</strong> Persistent
                            preferences such as remembering login status so you
                            do not need to re-enter credentials repeatedly.
                        </li>
                    </ul>

                    <h3>Use of Your Personal Data</h3>
                    <p>The Company may use Personal Data to:</p>
                    <ul>
                        <li>Provide and maintain Our Service.</li>
                        <li>
                            Manage Your Account and registration as a user of
                            the Service.
                        </li>
                        <li>
                            Contact You via email regarding updates, security
                            alerts, and customer support.
                        </li>
                        <li>
                            Store and calculate your recipe nutritional values
                            and daily meal logs.
                        </li>
                    </ul>

                    <h3>Sharing of Your Personal Data</h3>
                    <p>
                        We do not sell your personal data. We may share
                        information only in limited circumstances:
                    </p>
                    <ul>
                        <li>
                            <strong>With Service Providers:</strong> Trusted
                            infrastructure hosting providers (such as database
                            and cloud hosting platforms) strictly to operate the
                            Service.
                        </li>
                        <li>
                            <strong>For Business Transfers:</strong> In
                            connection with any merger, sale of company assets,
                            or financing.
                        </li>
                        <li>
                            <strong>With Your Consent:</strong> We may disclose
                            Your Personal Data for any other purpose with Your
                            explicit consent.
                        </li>
                    </ul>

                    <h2>3. Retention of Your Personal Data</h2>
                    <p>
                        The Company retains Your Personal Data only for as long
                        as necessary to fulfill the purposes set out in this
                        Privacy Policy, comply with legal obligations, and
                        resolve disputes. Account information is retained for
                        the duration of your active account relationship.
                    </p>

                    <h2>4. Transfer of Your Personal Data</h2>
                    <p>
                        Your information may be processed and stored on cloud
                        servers located outside of Your state or country. We
                        ensure all transfers are subject to appropriate
                        technical safeguards and encryption.
                    </p>

                    <h2>5. Delete Your Personal Data</h2>
                    <p>
                        You have the right to delete or request that We assist
                        in deleting the Personal Data We have collected about
                        You. You may remove individual recipes, clear daily meal
                        logs, or contact us at any time to request complete
                        account and data deletion.
                    </p>

                    <h2>6. Disclosure of Your Personal Data</h2>
                    <p>
                        Under certain circumstances, We may be required to
                        disclose Your Personal Data if required to do so by law
                        or in response to valid requests by public authorities
                        (such as a court or government agency).
                    </p>

                    <h2>7. Security of Your Personal Data</h2>
                    <p>
                        The security of Your Personal Data is a top priority. We
                        utilize industry-standard cryptographic hashing (bcrypt)
                        for passwords, JSON Web Tokens (JWT) for session
                        authorization, and HTTPS encryption in transit. While no
                        electronic storage is 100% immune to vulnerabilities, we
                        employ robust commercial practices to safeguard your
                        data.
                    </p>

                    <h2>8. Children&apos;s and Minors&apos; Privacy</h2>
                    <p>
                        Our Service is not directed to anyone under the age of
                        16. We do not knowingly collect personal information
                        from children under 16. If you become aware that a child
                        has provided us with data without parental consent,
                        please contact us to delete it immediately.
                    </p>

                    <h2>9. Changes to This Privacy Policy</h2>
                    <p>
                        We may update Our Privacy Policy from time to time. We
                        will notify You of any changes by updating the
                        &quot;Last updated&quot; date at the top of this Privacy
                        Policy.
                    </p>

                    <h2>10. Contact Us</h2>
                    <p>
                        If you have any questions, suggestions, or data requests
                        regarding this Privacy Policy, please contact us at:{" "}
                        <a href="mailto:martaokilka@gmail.com">
                            martaokilka@gmail.com
                        </a>
                    </p>
                </article>

                {/* Bottom Actions */}
                <div className="legal-page__footer-actions">
                    <Link to="/" className="legal-page__action-btn">
                        <ArrowLeft size={16} />
                        <span>Return to Home</span>
                    </Link>

                    <button
                        type="button"
                        className="legal-page__action-btn"
                        onClick={handleScrollToTop}
                    >
                        <span>Back to top</span>
                        <ArrowUp size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

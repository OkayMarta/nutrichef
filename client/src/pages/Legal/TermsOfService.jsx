import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUp } from "lucide-react";
import "./LegalPage.scss";

const TermsOfService = () => {
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
                        Last updated: September 2026
                    </span>
                    <h1 className="legal-page__title">Terms of Service</h1>
                    <p className="legal-page__subtitle">
                        Welcome to NutriChef. Please read these Terms of Service
                        carefully before using our platform.
                    </p>
                </header>

                {/* Important Medical Disclaimer Callout */}
                <div className="legal-page__callout legal-page__callout--warning">
                    <h3>Important Notice: Nutritional & Medical Disclaimer</h3>
                    <p>
                        All calculations, calorie estimations, macronutrient
                        ratios, and daily tips provided by NutriChef are
                        strictly for informational and educational purposes.
                        NutriChef does not provide medical advice, diagnosis, or
                        treatment.
                    </p>
                </div>

                {/* Main Content */}
                <article className="legal-page__content">
                    <p>
                        These Terms of Service (&quot;Terms&quot;) govern your
                        access to and use of the NutriChef website and
                        application (the &quot;Service&quot;). By accessing or
                        using the Service, registering an account, or signing in
                        via Google, you agree to be bound by these Terms.
                    </p>

                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using NutriChef, you affirm that you are
                        at least 13 years of age and legally capable of entering
                        into this agreement. If you do not agree to these Terms,
                        please do not use the Service.
                    </p>

                    <h2>2. User Accounts &amp; Authentication</h2>
                    <p>
                        <strong>Account Creation:</strong> To access features
                        such as saving custom recipes, calculating per-100g
                        nutritional breakdowns, and tracking daily meals, you
                        must create an account using an email and password or
                        authenticate using Google OAuth.
                    </p>
                    <p>
                        <strong>Account Security:</strong> You are responsible
                        for safeguarding your login credentials. You agree to
                        notify us immediately of any unauthorized access or
                        breach of security.
                    </p>
                    <p>
                        <strong>Termination:</strong> NutriChef reserves the
                        right to suspend or terminate accounts that violate
                        these Terms or engage in abusive behavior.
                    </p>

                    <h2>3. User Content &amp; Saved Data</h2>
                    <p>
                        Users may input dish names, ingredients, cooked weights,
                        and macronutrient values, as well as log daily meal
                        portions (&quot;User Content&quot;).
                    </p>
                    <p>
                        You retain full ownership of any content you create. You
                        grant NutriChef a non-exclusive, worldwide license to
                        store, process, and display this data solely for
                        providing the Service to you.
                    </p>
                    <p>
                        <strong>
                            We do not sell or monetize your recipe data or
                            personal meal logs.
                        </strong>
                    </p>

                    <h2>4. Nutritional &amp; Medical Disclaimer</h2>
                    <p>
                        <strong>Informational Purposes Only:</strong> All
                        nutritional calculations, calorie estimations,
                        macronutrient ratios, and daily tips provided by
                        NutriChef are for informational and educational purposes
                        only.
                    </p>
                    <p>
                        <strong>Not Medical Advice:</strong> NutriChef is not a
                        medical organization, and our calculations do not
                        constitute medical, dietary, or healthcare advice.
                        Consult a qualified healthcare professional or
                        registered dietitian before making significant changes
                        to your diet or wellness routine.
                    </p>
                    <p>
                        <strong>Accuracy:</strong> While we strive for
                        computational precision, nutritional values of cooked
                        dishes may vary depending on ingredients, cooking
                        methods, and input precision.
                    </p>

                    <h2>5. Intellectual Property</h2>
                    <p>
                        The NutriChef brand, logo, user interface designs,
                        custom graphics, and software code are the intellectual
                        property of NutriChef and its developers. You may not
                        copy, reverse engineer, or redistribute our proprietary
                        assets without prior written consent.
                    </p>

                    <h2>6. Disclaimer of Warranties (&quot;As Is&quot;)</h2>
                    <p>
                        The Service is provided on an &quot;AS IS&quot; and
                        &quot;AS AVAILABLE&quot; basis without warranties of any
                        kind, either express or implied, including fitness for a
                        particular purpose, availability, or uninterrupted
                        operation.
                    </p>

                    <h2>7. Limitation of Liability</h2>
                    <p>
                        To the maximum extent permitted by applicable law,
                        NutriChef and its creators shall not be liable for any
                        indirect, incidental, or consequential damages resulting
                        from your use of or inability to use the Service.
                    </p>

                    <h2>8. Changes to These Terms</h2>
                    <p>
                        We may revise these Terms occasionally. Any changes will
                        be posted on this page with an updated revision date.
                        Continued use of the Service after changes are published
                        constitutes your acceptance of the updated Terms.
                    </p>

                    <h2>9. Contact Us</h2>
                    <p>
                        If you have any questions or concerns regarding these
                        Terms, please contact us via email at:{" "}
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

export default TermsOfService;

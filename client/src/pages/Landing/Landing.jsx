import HeroSection from "./components/HeroSection/HeroSection";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import WhyNutriChef from "./components/WhyNutriChef/WhyNutriChef";
import CtaBanner from "./components/CtaBanner/CtaBanner";
import Footer from "./components/Footer/Footer";
import "./Landing.scss";

const Landing = () => {
    return (
        <div className="landing-page">
            <HeroSection />
            <HowItWorks />
            <WhyNutriChef />
            <CtaBanner />
            <Footer />
        </div>
    );
};

export default Landing;

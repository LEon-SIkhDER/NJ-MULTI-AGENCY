import { HeroSection } from './HeroSection';
import { SocialProofStrip } from './SocialProofStrip';
import { WhyUsSection } from './WhyUsSection';
import { CaseStudiesSection } from './CaseStudiesSection';
import { ProcessSection } from './ProcessSection';
import { PaymentSection } from './PaymentSection';
import { VisionStrip } from './VisionStrip';
import { ContactSection } from './ContactSection';

const Home = () => {
    return (
        <>
            <HeroSection></HeroSection>
            <SocialProofStrip></SocialProofStrip>
            <WhyUsSection></WhyUsSection>
            <CaseStudiesSection></CaseStudiesSection>
            <ProcessSection></ProcessSection>
            <PaymentSection></PaymentSection>
            <VisionStrip></VisionStrip>
            <ContactSection></ContactSection>
        </>
    );
};

export default Home;

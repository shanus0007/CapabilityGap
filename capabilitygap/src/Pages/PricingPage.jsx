import React from 'react';
import PricingSection from '../Components/PricingSection';

const PricingPage = ({ session }) => {
    return (
        <div className="min-h-screen bg-white pt-20">
            <PricingSection session={session} />
        </div>
    );
};

export default PricingPage;

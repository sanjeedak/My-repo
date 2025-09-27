import React from 'react';

const Stepper = ({ currentStep }) => {
    // UPDATED: Added "Business Info" as the third step
    const steps = ['Vendor Info', 'Shop Info', 'Business Info'];

    return (
        <div className="flex items-center w-full mb-8">
            {steps.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;

                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center text-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                                    isActive ? 'bg-blue-600 text-white scale-110' : 
                                    isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                                }`}
                            >
                                {isCompleted ? '✔' : stepNumber}
                            </div>
                            <p className={`mt-2 text-[10px] sm:text-xs font-semibold ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                                {step}
                            </p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-1 mx-2 transition-colors duration-300 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Stepper;
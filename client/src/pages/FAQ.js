import React from 'react';

const FAQ = () => {
  const faqs = [
    { question: 'How do I create a donation drive?', answer: 'As a beneficiary, log in, go to "Create Drive," and fill out the form with your drive details.' },
    { question: 'Can I donate both money and items?', answer: 'Yes! You can choose to donate money or in-kind items when making a donation.' },
    { question: 'How are donations tracked?', answer: 'All donations are recorded and can be viewed in your "My Donations" section if you’re a donor.' },
  ];

  return (
    <div className="fade-in" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' }}>Frequently Asked Questions</h1>
      <div>
        {faqs.map((faq, index) => (
          <div key={index} style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>{faq.question}</h2>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
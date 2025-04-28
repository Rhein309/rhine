import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';

const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    childName: '',
    childAge: '',
    message: '',
    submitted: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send the form data to your backend
    console.log('Form submitted:', formState);
    // Simulate form submission
    setTimeout(() => {
      setFormState(prev => ({ ...prev, submitted: true }));
    }, 1000);
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-lg text-gray-600">
            Have questions or ready to enroll? Fill out the form below and our team will get back to you shortly.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-purple-100 text-purple-900 p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                <p className="mb-8">
                  We're excited to hear from you! Complete the form or contact us directly using the information below.
                </p>
                <div className="space-y-4 mb-8">
                  <p className="flex items-center">
                    <Mail className="w-5 h-5 mr-3" />
                    info@littlehands.edu.hk
                  </p>
                </div>
              </div>
              <div className="text-purple-700 text-sm">
                <p>© 2025 Little Hands Learning Centre</p>
                <p>All rights reserved</p>
              </div>
            </div>
            <div className="md:w-2/3 p-8">
              {formState.submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
                  <p className="text-gray-600 mb-6">
                    Your message has been received. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setFormState(prev => ({ ...prev, submitted: false }))}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-md transition-colors duration-200"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formState.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="childName" className="block text-gray-700 font-medium mb-2">Child's Name</label>
                      <input
                        type="text"
                        id="childName"
                        name="childName"
                        value={formState.childName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="childAge" className="block text-gray-700 font-medium mb-2">Child's Age</label>
                      <select
                        id="childAge"
                        name="childAge"
                        value={formState.childAge}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Age</option>
                        {Array.from({ length: 10 }, (_, i) => i + 3).map(age => (
                          <option key={age} value={age}>{age} years</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="program" className="block text-gray-700 font-medium mb-2">Interested Program</label>
                      <select
                        id="program"
                        name="program"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select Program</option>
                        <option value="phonics">Phonics Foundation</option>
                        <option value="readers">Young Readers</option>
                        <option value="grammar">Grammar & Writing</option>
                        <option value="advanced">Advanced English</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-md transition-colors duration-200"
                  >
                    Send Message <Send className="w-4 h-4 ml-2" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
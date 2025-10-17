import React, { useState } from 'react';
import { useStudent } from './context/StudentContext.js';
import { collection, doc, setDoc } from 'firebase/firestore';

const SignupForm = () => {
  const { setView, setUserData, db, userId } = useStudent();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    class: '',
    email: '',
    phone: '' ,
    registrationFee: 1500,
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePayment = () => {
    setMessage({ text: '', type: '' });
    setIsProcessingPayment(true);

    const razorpayScript = document.createElement('script');
    razorpayScript.src = "https://checkout.razorpay.com/v1/checkout.js";
    razorpayScript.onload = () => {
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID",
        amount: formData.registrationFee * 100,
        currency: "INR",
        name: "Shiksha Institute",
        description: "Student Registration Fee",
        handler: function (response) {
          setIsProcessingPayment(false);
          setPaymentVerified(true);
          setMessage({ text: 'Payment successful! You can now complete your registration.', type: 'success' });
          console.log("Payment successful with ID:", response.razorpay_payment_id);
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
            setMessage({ text: 'Payment cancelled. Please try again to complete registration.', type: 'error' });
          }
        }
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    };
    document.body.appendChild(razorpayScript);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    for (const key in formData) {
      if (formData[key] === '' && key !== 'registrationFee') {
        setMessage({ text: 'Please fill out all fields.', type: 'error' });
        return;
      }
    }

    if (!paymentVerified) {
      setMessage({ text: 'Please complete payment first.', type: 'error' });
      return;
    }

    if (db && userId) {
      try {
        const appId = 'default-app-id';
        const collectionPath = `/artifacts/${appId}/users/${userId}/students`;
        const userDocRef = doc(collection(db, collectionPath), userId);
        await setDoc(userDocRef, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          class: formData.class,
          email: formData.email,
          phone: formData.phone,
          createdAt: new Date(),
        });
        console.log("Document successfully written!");

        setUserData(formData);
        setView('create-password');
      } catch (e) {
        console.error("Error adding document: ", e);
        setMessage({ text: 'Registration failed. Please try again.', type: 'error' });
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
      <div className="flex justify-center mb-6">
        <img src="/shikhsa_logo.png" alt="Shiksha Institute Logo" className="rounded-full shadow-lg" />
      </div>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Student Sign Up</h2>
      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="flex space-x-4">
          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        <div className="flex space-x-4 items-center">
          <label htmlFor="class" className="text-gray-600 font-medium">Class:</label>
          <select name="class" id="class" value={formData.class} onChange={handleInputChange} className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            <option value="" disabled>Select Class</option>
            {[8, 9, 10, 11, 12].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone No." className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
          <span className="text-gray-600 font-medium">Registration Fee:</span>
          <span className="text-lg font-bold text-gray-800">₹1500</span>
        </div>
        <button
          type="button"
          onClick={handlePayment}
          disabled={isProcessingPayment || paymentVerified}
          className={`w-full font-bold py-3 rounded-lg shadow-md transition duration-300 ease-in-out ${isProcessingPayment || paymentVerified ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
        >
          {isProcessingPayment ? 'Processing...' : paymentVerified ? 'Payment Verified' : 'Pay & Verify'}
        </button>
        {message.text && (
          <div className={`p-3 rounded-lg text-sm text-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
        <button
          type="submit"
          disabled={!paymentVerified}
          className={`w-full font-bold py-3 rounded-lg shadow-md transition duration-300 ease-in-out ${paymentVerified ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`}
        >
          Sign Up
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Already have an account? <span onClick={() => setView('login')} className="text-blue-600 cursor-pointer font-semibold hover:underline">Login here</span>
      </p>
    </div>
  );
};

export default SignupForm;

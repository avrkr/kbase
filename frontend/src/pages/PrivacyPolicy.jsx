import { Shield, Lock, Eye } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-4">
          <Shield size={24} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-slate-500">Last updated: December 11, 2025</p>
      </div>

      <div className="prose prose-slate max-w-none">
        <h3>1. Introduction</h3>
        <p>
          Welcome to kbase. We respect your privacy and are committed to protecting your personal data. 
          This privacy policy will inform you as to how we look after your personal data when you visit our website 
          and tell you about your privacy rights and how the law protects you.
        </p>

        <h3>2. Data We Collect</h3>
        <p>
          We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
        </p>
        <ul>
          <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
          <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
          <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
        </ul>

        <h3>3. How We Use Your Data</h3>
        <p>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
        </p>
        <ul>
          <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
          <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
          <li>Where we need to comply with a legal or regulatory obligation.</li>
        </ul>

        <h3>4. Data Security</h3>
        <p>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
        </p>

        <h3>5. Contact Us</h3>
        <p>
          If you have any questions about this privacy policy or our privacy practices, please contact us at support@kbase.com.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

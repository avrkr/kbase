import { FileText, Scale, AlertCircle } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100">
      <div className="mb-8 border-b border-slate-100 pb-6">
        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 mb-4">
          <FileText size={24} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-slate-500">Last updated: December 11, 2025</p>
      </div>

      <div className="prose prose-slate max-w-none">
        <h3>1. Agreement to Terms</h3>
        <p>
          By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations. 
          If you do not agree with these terms, you are prohibited from using or accessing this site.
        </p>

        <h3>2. Use License</h3>
        <p>
          Permission is granted to temporarily download one copy of the materials (information or software) on kbase's website for personal, 
          non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul>
          <li>modify or copy the materials;</li>
          <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
          <li>attempt to decompile or reverse engineer any software contained on kbase's website;</li>
          <li>remove any copyright or other proprietary notations from the materials; or</li>
          <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
        </ul>

        <h3>3. User Content</h3>
        <p>
          You retain ownership of any content you post to the platform. However, by posting content, you grant kbase a worldwide, non-exclusive, 
          royalty-free license to use, reproduce, and distribute your content in connection with the service.
        </p>

        <h3>4. Disclaimer</h3>
        <p>
          The materials on kbase's website are provided on an 'as is' basis. kbase makes no warranties, expressed or implied, and hereby disclaims 
          and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular 
          purpose, or non-infringement of intellectual property or other violation of rights.
        </p>

        <h3>5. Governing Law</h3>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction 
          of the courts in that location.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;

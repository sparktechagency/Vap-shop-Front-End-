import React from "react";

export default function Page() {
  return (
    <div className="!my-[100px] !px-4 md:!px-[7%]">
      <h1 className="!mb-12 text-2xl md:text-4xl font-bold">{data.title}</h1>
      {data.para.split("\n\n").map((paragraph, i) => (
        <p key={i} className="!mb-4 text-sm">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

const data = {
  title: `Vape Shop Maps - Terms of Service`,
  para: `Effective Date: [Insert Date]
Last Updated: [Insert Date]

Welcome to Vape Shop Maps Corp (“Company,” “we,” “us,” or “our”). By using our platform, website, or services, you agree to comply with and be bound by these Terms of Service. If you do not agree with these terms, you may not use Vape Shop Maps.

1. Acceptance of Terms
By accessing or using Vape Shop Maps, you agree to these Terms of Service, our Privacy Policy, and any other applicable policies.
If you are using the platform on behalf of a business, you confirm that you have the authority to bind that business to these terms.

2. Eligibility & Age Restrictions
You must be 21 years of age or older to use Vape Shop Maps.
Users located in restricted areas where vape or hemp-related products are banned are prohibited from accessing or using this platform.
Vape Shop Maps reserves the right to restrict or terminate accounts that violate age or location restrictions.

3. Account Registration & Responsibilities
Account Creation: You may be required to create an account to access certain features. You are responsible for maintaining the security of your account credentials.
Accuracy of Information: You agree to provide accurate, current, and complete information during registration and keep your account details updated.
Account Security: You are responsible for all activities under your account and must promptly notify us of any unauthorized access.

4. Prohibited Conduct
Users agree NOT to:
Use the platform for illegal, fraudulent, or unauthorized purposes.
Violate any applicable local, state, national, or international laws regarding vape or hemp products.
Post false, misleading, or defamatory content about brands, stores, or products.
Upload, transmit, or distribute malware, viruses, or any malicious software.
Attempt to hack, scrape, or disrupt the Vape Shop Maps platform.

5. Business Listings & User-Generated Content
Stores and brands are responsible for ensuring their listings comply with all applicable laws and regulations.
Users may leave reviews, ratings, and feedback; however, Vape Shop Maps reserves the right to moderate or remove inappropriate content.
Vape Shop Maps is not responsible for the accuracy of user-generated content, including business information provided by stores or brands.

6. Advertising, Subscriptions, & Payments
Certain features, including advertising placements and store subscriptions, require payment.
By purchasing a subscription or paid feature, you agree to our Billing & Refund Policy.
Auto-Renewal: Subscriptions automatically renew unless canceled before the billing period ends.
No refunds will be provided for unused portions of a subscription unless stated in our Refund Policy.
Vape Shop Maps reserves the right to change pricing and subscription plans with notice.

7. Termination & Account Suspension
Vape Shop Maps may suspend or terminate your account if you violate these terms or engage in prohibited activities.
You may cancel your account at any time, but subscription fees are non-refundable unless otherwise stated.
We reserve the right to refuse service to anyone at our discretion.

8. Limitation of Liability
Vape Shop Maps is a marketplace platform and is NOT responsible for transactions, products, or interactions between businesses and users.
We do not verify store compliance with local laws, and users are responsible for ensuring they purchase legal products.
To the fullest extent permitted by law, Vape Shop Maps shall not be liable for indirect, incidental, special, or consequential damages arising from the use of our platform.

9. Intellectual Property Rights
Vape Shop Maps and its content, including logos, trademarks, and software, are owned by the Company and protected by intellectual property laws.
Users may not reproduce, distribute, or modify any part of the platform without express permission.

10. Third-Party Links & External Content
Vape Shop Maps may contain links to third-party websites, stores, or promotions.
We do not endorse or control third-party sites and are not responsible for their content, policies, or transactions.

11. Dispute Resolution & Governing Law
These Terms shall be governed by the laws of [Insert Jurisdiction], without regard to conflict of law principles.
Any disputes arising from these terms will be resolved through binding arbitration or mediation, except where prohibited by law.
Users waive the right to participate in class action lawsuits against Vape Shop Maps.

12. Changes to These Terms
We may update these Terms of Service periodically. Changes will be posted with a revised effective date.
If significant changes affect user rights, we will notify users via email or an in-app notification.

13. Contact Information
If you have any questions regarding these Terms of Service, please contact us:
Email: [Insert Contact Email]
Address: [Insert Business Address]
Website: [Insert Website URL]
By using Vape Shop Maps, you agree to abide by these Terms of Service.`,
};

import React from "react";

interface IProps {
    appName: string;
}

export const PrivacyPolicyContent = (props: IProps) => {
    return (
        <div className="privacy-policy">

            <h2>{props.appName} - Privacy Policy</h2>

            <section id="privacy-information-we-collect">
                <h4>What information do we collect?</h4>
                <p>We do not collect any of your information when you use our application.</p>
            </section>

            <section id="privacy-permissions">
            <h4>Which android permissions do we use</h4>
            <p>We commonly use two permisions in our applications. Here are the reasons of their usage:</p>
            <ul>
                <li><b>Read Phone State</b> - We need to know if there is an internet connection for third party libraries like Google or advertisement networks.</li>
                <li><b>Camera</b> - We use your phone camera <b>ONLY</b> in Augmented Reality or Virtual Reality modes in our applications that contain these modes.</li>
                <li><b>Location</b> - Optional permission. Required for global, online users map.</li>
            </ul>
            </section>

            <section id="privacy-protection">
                <h4>How do we protect your information?</h4>
                <p>We only use Google libraries for online gaming or dashboards in our games, so your information is secured by Google the same way as your Google account is.</p>
            </section>

            <section id="privacy-disclose-third-party">
                <h4>Do we disclose any information to outside parties?</h4>
                <p>We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our application, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our application policies, or protect ours or others rights, property, or safety. However, non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.</p>
            </section>

            <section id="privacy-third-party-links">
                <h4>Third party links</h4>
                <p>Occasionally, at our discretion, we may include or offer third party products or services in our application. These third party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our application and welcome any feedback about these sites.</p>
            </section>

            <section id="privacy-online">
                <h4>Online Privacy Policy Only</h4>
                <p>This online privacy policy applies only to information collected through our application and not to information collected offline.</p>
            </section>

            <section id="privacy-consent">
                <h4>Your Consent</h4>
                <p>By using our application, you consent to our application privacy policy.</p>
            </section>

            <section id="privacy-changes">
                <h4>Changes to our Privacy Policy</h4>
                <p>If we decide to change our privacy policy, we will post those changes on this page, and/or update the Privacy Policy modification date below.</p>
            </section>

            <section id="privacy-contact-us">
                <h4>Contact</h4>
                <p className="emailDescription">If there are any questions regarding this privacy policy you may contact me using the information below.</p>
                <p className="email">ntwins.info@gmail.com</p>
            </section>

        </div>
    );
};

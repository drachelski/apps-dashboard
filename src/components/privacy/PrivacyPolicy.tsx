import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { CONTACT_EMAIL } from '@/lib/site';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box component="section" sx={{ mt: 4 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

const P = ({ children }: { children: ReactNode }) => (
  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
    {children}
  </Typography>
);

export function PrivacyPolicy({ appTitle }: { appTitle: string }) {
  return (
    <Box>
      <Typography variant="h1" sx={{ fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
        {appTitle} — Privacy Policy
      </Typography>

      <Section title="What information do we collect?">
        <P>We do not collect any of your information when you use our application.</P>
      </Section>

      <Section title="Which Android permissions do we use">
        <P>
          We commonly use the following permissions in our applications. Here are the reasons of
          their usage:
        </P>
        <Box component="ul" sx={{ pl: 3, color: 'text.secondary', lineHeight: 1.7 }}>
          <li>
            <b>Read Phone State</b> - We need to know if there is an internet connection for third
            party libraries like Google or advertisement networks.
          </li>
          <li>
            <b>Camera</b> - We use your phone camera <b>ONLY</b> in Augmented Reality or Virtual
            Reality modes in our applications that contain these modes.
          </li>
          <li>
            <b>Location</b> - Optional permission. Required for global, online users map.
          </li>
        </Box>
      </Section>

      <Section title="How do we protect your information?">
        <P>
          We only use Google libraries for online gaming or dashboards in our games, so your
          information is secured by Google the same way as your Google account is.
        </P>
      </Section>

      <Section title="Do we disclose any information to outside parties?">
        <P>
          We do not sell, trade, or otherwise transfer to outside parties your personally
          identifiable information. This does not include trusted third parties who assist us in
          operating our application, conducting our business, or servicing you, so long as those
          parties agree to keep this information confidential. We may also release your information
          when we believe release is appropriate to comply with the law, enforce our application
          policies, or protect ours or others rights, property, or safety. However, non-personally
          identifiable visitor information may be provided to other parties for marketing,
          advertising, or other uses.
        </P>
      </Section>

      <Section title="Third party links">
        <P>
          Occasionally, at our discretion, we may include or offer third party products or services
          in our application. These third party sites have separate and independent privacy
          policies. We therefore have no responsibility or liability for the content and activities
          of these linked sites. Nonetheless, we seek to protect the integrity of our application
          and welcome any feedback about these sites.
        </P>
      </Section>

      <Section title="Online Privacy Policy Only">
        <P>
          This online privacy policy applies only to information collected through our application
          and not to information collected offline.
        </P>
      </Section>

      <Section title="Your Consent">
        <P>By using our application, you consent to our application privacy policy.</P>
      </Section>

      <Section title="Changes to our Privacy Policy">
        <P>
          If we decide to change our privacy policy, we will post those changes on this page, and/or
          update the Privacy Policy modification date below.
        </P>
      </Section>

      <Section title="Contact">
        <P>
          If there are any questions regarding this privacy policy you may contact me using the
          information below.
        </P>
        <Typography
          component="a"
          href={`mailto:${CONTACT_EMAIL}`}
          sx={{ display: 'inline-block', mt: 1, color: 'secondary.main' }}
        >
          {CONTACT_EMAIL}
        </Typography>
      </Section>
    </Box>
  );
}

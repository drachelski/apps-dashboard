'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { colors } from '@/theme/tokens';

// BUILD_YEAR is inlined at build time (next.config.ts) so server HTML and first client render match;
// the effect then switches to the visitor's current year, so the footer never goes stale.
const buildYear = () => Number(process.env.BUILD_YEAR) || new Date().getFullYear();

export function Footer() {
  const [year, setYear] = useState(buildYear);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <Box
      component="footer"
      sx={{ py: 4, mt: 8, textAlign: 'center', borderTop: `1px solid ${colors.border}` }}
    >
      <Typography variant="body2" color="text.secondary">
        © {year} ntwins. All rights reserved.
      </Typography>
    </Box>
  );
}

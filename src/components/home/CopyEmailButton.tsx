'use client';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';

export function CopyEmailButton({ email }: { email: string }) {
  const [canCopy, setCanCopy] = useState(false);
  const [copied, setCopied] = useState(false);

  // Clipboard API is missing on insecure origins and some browsers — keep only the mailto link then.
  useEffect(() => {
    setCanCopy(typeof navigator.clipboard?.writeText === 'function');
  }, []);

  if (!canCopy) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      setCanCopy(false);
    }
  };

  return (
    <>
      <Tooltip title="Copy email">
        <IconButton aria-label="Copy email address" color="inherit" onClick={copy}>
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Snackbar
        open={copied}
        autoHideDuration={2500}
        onClose={() => setCopied(false)}
        message="Email copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}

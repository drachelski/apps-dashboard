'use client';

import Button, { type ButtonProps } from '@mui/material/Button';
import NextLink from 'next/link';
import type { ReactNode } from 'react';

/** MUI Button rendered as next/link — usable from server components (no component props cross the boundary). */
export interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonProps['variant'];
  color?: ButtonProps['color'];
  size?: ButtonProps['size'];
  startIcon?: ReactNode;
  sx?: ButtonProps['sx'];
}

export function ButtonLink({ href, children, ...props }: ButtonLinkProps) {
  return (
    <Button component={NextLink} href={href} {...props}>
      {children}
    </Button>
  );
}

import React from 'react';
import { Box } from '@mui/material';
import Link from 'next/link';

export interface LinkItem {
  href: string;
  text: string;
  ariaLabel?: string;
}

interface FormLinksProps {
  links: LinkItem[];
  className?: string;
  linkClassName?: string;
}

const FormLinks: React.FC<FormLinksProps> = ({
  links,
  className,
  linkClassName,
}) => {
  return (
    <Box className={className}>
      {links.map((link, index) => (
        <Link 
          key={index}
          href={link.href} 
          className={linkClassName} 
          passHref
          aria-label={link.ariaLabel || link.text}
        >
          {link.text}
        </Link>
      ))}
    </Box>
  );
};

export default FormLinks; 
import React from 'react';

export default ({ children, ...rest }: React.SVGAttributes<SVGSVGElement>): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...rest}>
    <path d="M8 0C5.791 0 4 2.239 4 5s1.791 5 4 5 4-2.239 4-5-1.791-5-4-5zM3.812 10c-2.1.1-3.813 1.9-3.813 4v2h16v-2c0-2.1-1.713-3.9-3.813-4-1.1 1.2-2.588 2-4.188 2-1.6 0-3.088-.8-4.188-2z" />
    {children}
  </svg>
);

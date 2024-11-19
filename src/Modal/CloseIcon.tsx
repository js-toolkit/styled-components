import React from 'react';

export default ({ children, ...rest }: React.SVGAttributes<SVGSVGElement>): JSX.Element => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...rest}>
    <path d="M12.656 4.281l-3.719 3.719 3.719 3.719-0.938 0.938-3.719-3.719-3.719 3.719-0.938-0.938 3.719-3.719-3.719-3.719 0.938-0.938 3.719 3.719 3.719-3.719z" />
    {children}
  </svg>
);

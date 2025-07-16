import * as React from 'react';

const DropDownIcon = (): React.ReactElement => (
    <svg
        width="30px"
        height="26px"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width={16} height={16} fill="none" />
        <path
            d="M3 6 L13 6 M3 10 L13 10 M3 14 L13 14"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
        />
    </svg>
);

export default DropDownIcon;

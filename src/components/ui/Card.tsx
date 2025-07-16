import type { ReactNode, HTMLAttributes } from 'react';

type CardProps = {
    children: ReactNode;
    className?: string;
} & HTMLAttributes<HTMLDivElement>;

const Card = ({ children, className = '', ...props }: CardProps) => {
    return (
        <div
            className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
export default Card;
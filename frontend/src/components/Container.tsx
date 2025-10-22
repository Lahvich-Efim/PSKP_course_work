import * as React from 'react';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'; // опционально
}

const Container = ({
    children,
    className = '',
    maxWidth = 'full',
}: ContainerProps) => {
    const maxWidthClass =
        maxWidth === 'full' ? 'max-w-full' : `max-w-screen-2xl`;

    return (
        <div className={`w-full mx-auto ${maxWidthClass} ${className}`}>
            {children}
        </div>
    );
};

export default Container;

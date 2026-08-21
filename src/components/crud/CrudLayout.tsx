import type {ReactNode} from 'react';
import {Flex} from 'antd';

interface CrudLayoutProps {
    children: ReactNode;
}

export function CrudLayout({children}: CrudLayoutProps) {
    return (
        <Flex vertical gap="medium">
            {children}
        </Flex>
    );
}

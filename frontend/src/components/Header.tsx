import { Button } from '../components/ui/button';
import Container from '@/components/Container.tsx';
import { useAppDispatch } from '@/hooks/hook_redux.ts';
import { logout } from '@/features/auth/authSlice.ts';
import { SidebarTrigger } from '@/components/ui/sidebar.tsx';
import * as React from 'react';

interface HeaderProps {
    title?: string;
}

const Header = ({ title }: HeaderProps) => {
    const dispatch = useAppDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('handleSubmit', e);
        await dispatch(logout());
    };

    return (
        <header className="w-full bg-gray-100 shadow py-4 ">
            <Container className="flex justify-between items-center px-4">
                <SidebarTrigger />
                <Container
                    maxWidth={'2xl'}
                    className="flex justify-between items-center"
                >
                    <h1 className="text-xl font-semibold">
                        PSKP Platform - {title}
                    </h1>
                    <Button variant="outline" onClick={handleSubmit}>
                        Выйти
                    </Button>
                </Container>
            </Container>
        </header>
    );
};

export default Header;

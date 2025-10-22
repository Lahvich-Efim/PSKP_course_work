import Container from '@/components/Container.tsx';
import AppSidebar from '@/components/AppSidebar.tsx';
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx';
import Header from '@/components/Header.tsx';
import Footer from '@/components/Footer.tsx';
import { Toaster } from '@/components/ui/sonner.tsx';
import { useParticipant } from '@/hooks/query/useParticipants.ts';
import { useAppSelector } from '@/hooks/hook_redux.ts';

const MainLayout = () => {
    const { id, role } = useAppSelector((state) => state.auth);
    const { data: participant } = useParticipant(id);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Toaster />
                <Header
                    title={
                        role == 'participant'
                            ? participant
                                ? participant.name
                                : ''
                            : 'Координатор'
                    }
                />
                <main className="flex-1">
                    <Container maxWidth={'2xl'} className=" px-4 pt-6 pb-6">
                        <div className="flex-1">
                            <Outlet />
                        </div>
                    </Container>
                </main>
                <Footer />
            </SidebarInset>
        </SidebarProvider>
    );
};

export default MainLayout;

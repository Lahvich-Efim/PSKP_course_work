import Container from '@/components/Container.tsx';
import AppSidebar from '@/components/AppSidebar.tsx';
import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx';
import Header from '@/components/Header.tsx';
import Footer from '@/components/Footer.tsx';

const MainLayout = () => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <Header />
                <main className="flex-1">
                    <Container className="max-w-screen-xl px-4 pt-6 pb-6">
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

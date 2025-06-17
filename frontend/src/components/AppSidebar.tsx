import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, Users, Package, Book, Box, Menu } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/hook_redux';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const coordinatorNavItems = [
    { label: 'Основная', path: '/coordinator', icon: Home },
    { label: 'Участники', path: '/coordinator/participants', icon: Users },
    { label: 'Поставки', path: '/coordinator/supplies', icon: Package },
];

const participantNavItems = [
    { label: 'Основная', path: '/participant', icon: Home },
    { label: 'Каталоги', path: '/participant/catalogs', icon: Book },
    { label: 'Продукты', path: '/participant/products', icon: Box },
];

export default function AppSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { role } = useAppSelector((state) => state.auth);
    const [open, setOpen] = useState(false);

    const navItems =
        role?.toLowerCase() === 'coordinator'
            ? coordinatorNavItems
            : participantNavItems;

    const menu = (
        <Sidebar className="w-64">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className={'text-sm pt-1 pb-1'}>
                        Меню
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map(({ label, path, icon: Icon }) => (
                                <SidebarMenuItem key={path}>
                                    <SidebarMenuButton
                                        className={'text-base'}
                                        asChild
                                        isActive={location.pathname === path}
                                    >
                                        <button
                                            onClick={() => {
                                                navigate(path);
                                                setOpen(false); // закрыть при мобиле
                                            }}
                                            className={cn(
                                                'w-full text-left flex items-center gap-2 px-2 py-1',
                                                location.pathname === path &&
                                                    'bg-muted',
                                            )}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {label}
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );

    return (
        <>
            <div className="hidden md:block">{menu}</div>

            <div className="md:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild />
                </Sheet>
            </div>
        </>
    );
}

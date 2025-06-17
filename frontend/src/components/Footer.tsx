import Container from '@/components/Container.tsx';

const Footer = () => {
    return (
        <footer className="w-full bg-gray-100 text-sm text-center py-4 mt-auto">
            <Container className="max-w-screen-xl">
                &copy; {new Date().getFullYear()} PSKP. Все права защищены.
            </Container>
        </footer>
    );
};

export default Footer;

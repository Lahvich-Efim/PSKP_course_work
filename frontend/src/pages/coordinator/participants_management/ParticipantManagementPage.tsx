import ParticipantForm from './ParticipantForm';
import ParticipantList from './ParticipantList';
import Container from '@/components/Container';

export default function ParticipantManagementPage() {
    return (
        <Container>
            <h1 className="text-3xl font-extrabold mb-6">
                Управление участниками
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <ParticipantForm />
                </div>
                <div className="md:col-span-2">
                    <ParticipantList />
                </div>
            </div>
        </Container>
    );
}

import ParticipantForm from './ParticipantForm';
import ParticipantList from './ParticipantList';
import Container from '@/components/Container';
import { useState } from 'react';
import type { RegisterParticipantInput } from '@/hooks/mutation/useParticipantsMutations.ts';
import { Button } from '@/components/ui/button.tsx';

export default function ParticipantManagementPage() {
    const [editingParticipant, setEditingParticipant] = useState<null | any>(
        null,
    );
    const [formVisible, setFormVisible] = useState(false);

    const handleAddClick = () => {
        setEditingParticipant(null);
        setFormVisible(true);
    };

    const handleEdit = (participant: any) => {
        setEditingParticipant(participant);
        setFormVisible(true);
    };

    const handleFormClose = () => {
        setEditingParticipant(null);
        setFormVisible(false);
    };

    return (
        <Container>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold">Участники</h1>
                {(editingParticipant || !formVisible) && (
                    <Button onClick={handleAddClick}>Добавить участника</Button>
                )}
            </div>

            {formVisible && (
                <div className="mb-6">
                    <ParticipantForm
                        participant={editingParticipant}
                        onClose={handleFormClose}
                    />
                </div>
            )}

            <ParticipantList onEdit={handleEdit} />
        </Container>
    );
}

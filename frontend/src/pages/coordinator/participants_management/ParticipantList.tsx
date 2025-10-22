import React, { useState } from 'react';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table';
import { useParticipants } from '@/hooks/query/useParticipants';
import { useDeleteParticipant } from '@/hooks/mutation/useParticipantsMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PaginationBar from '@/components/PaginationBar';
import { useFormErrors } from '@/hooks/useFormErrors.ts';

export default function ParticipantList({
    onEdit,
}: {
    onEdit: (p: any) => void;
}) {
    const [page, setPage] = useState(0);
    const limit = 10;

    const {
        items: participants,
        count,
        isLoading,
    } = useParticipants(page, limit);
    const remove = useDeleteParticipant();
    const { handleError, resetErrors } = useFormErrors(true);

    const deleteParticipant = (id: number) => {
        if (confirm('Удалить участника?')) {
            resetErrors();
            remove.mutate(id, {
                onError: handleError,
            });
        }
    };

    if (isLoading) return <div>Загрузка...</div>;

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Имя</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Описание</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {participants.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{p.user.email}</TableCell>
                            <TableCell>{p.description || '-'}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onEdit(p)}
                                    >
                                        Редактировать
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => deleteParticipant(p.id)}
                                    >
                                        Удалить
                                    </Button>
                                </>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="mt-4 flex justify-center">
                <PaginationBar
                    page={page}
                    totalPages={Math.ceil(count / limit)}
                    onChangePage={setPage}
                />
            </div>
        </>
    );
}

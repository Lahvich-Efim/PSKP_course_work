import React, { useState, useMemo } from 'react';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table';
import { useParticipants } from '@/hooks/query/useParticipants';
import { useCatalogs } from '@/hooks/query/useCatalogs';
import {
    useDeleteParticipant,
    useUpdateParticipant,
} from '@/hooks/mutation/useParticipantsMutations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PaginationBar } from '@/components/PaginationBar';

export default function ParticipantList() {
    const [page, setPage] = useState(0);
    const limit = 10;

    const {
        items: participants,
        count,
        isLoading,
    } = useParticipants(page, limit);
    const update = useUpdateParticipant(() => cancelEdit());
    const remove = useDeleteParticipant();

    const { items: allCatalogs } = useCatalogs(0, 10000);

    const blockedParticipants = useMemo(() => {
        const s = new Set<number>();
        allCatalogs.forEach((cat) => {
            const owner = participants.find((p) => p.name === cat.participant);
            if (owner) s.add(owner.id);
        });
        return s;
    }, [allCatalogs, participants]);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState({ name: '', description: '' });

    const startEdit = (p) => {
        setEditingId(p.id);
        setForm({ name: p.name, description: p.description || '' });
    };
    const cancelEdit = () => {
        setEditingId(null);
        setForm({ name: '', description: '' });
    };
    const saveEdit = () => {
        if (editingId !== null) {
            update.mutate({ id: editingId, data: form });
        }
    };
    const deleteParticipant = (id: number) => {
        if (blockedParticipants.has(id)) return;
        if (confirm('Удалить участника?')) remove.mutate(id);
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
                            <TableCell>
                                {editingId === p.id ? (
                                    <Input
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    p.name
                                )}
                            </TableCell>
                            <TableCell>{p.user.email}</TableCell>
                            <TableCell>
                                {editingId === p.id ? (
                                    <Textarea
                                        value={form.description}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    p.description || '-'
                                )}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                {editingId === p.id ? (
                                    <>
                                        <Button size="sm" onClick={saveEdit}>
                                            Сохранить
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={cancelEdit}
                                        >
                                            Отмена
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => startEdit(p)}
                                        >
                                            Редактировать
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                deleteParticipant(p.id)
                                            }
                                            disabled={blockedParticipants.has(
                                                p.id,
                                            )}
                                            title={
                                                blockedParticipants.has(p.id)
                                                    ? 'У участника есть каталоги — удалить нельзя'
                                                    : undefined
                                            }
                                        >
                                            Удалить
                                        </Button>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="mt-4 flex justify-center">
                <PaginationBar
                    page={page}
                    totalPages={Math.ceil(count / limit)}
                    setPage={setPage}
                />
            </div>
        </>
    );
}

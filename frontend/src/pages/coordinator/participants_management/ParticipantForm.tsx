import { useEffect, useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    useRegisterParticipant,
    useUpdateParticipant,
} from '@/hooks/mutation/useParticipantsMutations.ts';
import { useFormErrors } from '@/hooks/useFormErrors';

interface ParticipantFormProps {
    participant?: any;
    onClose: () => void;
}

export default function ParticipantForm({
    participant,
    onClose,
}: ParticipantFormProps) {
    const isEdit = !!participant;

    const [form, setForm] = useState({ name: '', description: '' });

    const { fieldErrors, handleError, resetErrors } = useFormErrors(true);

    const registerMutation = useRegisterParticipant(() => {
        setForm({ name: '', description: '' });
        resetErrors();
        onClose();
    });

    const updateMutation = useUpdateParticipant(() => onClose());

    useEffect(() => {
        if (isEdit) {
            setForm({
                name: participant.name,
                description: participant.description || '',
            });
            resetErrors();
        } else {
            setForm({ name: '', description: '' });
        }
    }, [participant]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        resetErrors();
        if (isEdit) {
            updateMutation.mutate(
                { id: participant.id, data: form },
                { onError: handleError },
            );
        } else {
            // регистрация нового участника, для которой нужны все поля
            registerMutation.mutate(form as any, { onError: handleError });
        }
    };

    const renderFieldError = (field: string) =>
        fieldErrors[field as keyof typeof fieldErrors] ? (
            <ul className="text-sm text-red-500 list-disc ml-4 break-words">
                {fieldErrors[field as keyof typeof fieldErrors]?.map(
                    (err, i) => <li key={i}>{err}</li>,
                )}
            </ul>
        ) : null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {isEdit ? 'Редактирование участника' : 'Новый участник'}
                </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="name">Имя участника</Label>
                        <Input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                        {renderFieldError('name')}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Описание</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                        />
                        {renderFieldError('description')}
                    </div>

                    {!isEdit && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={(form as any).username || ''}
                                    onChange={handleChange}
                                    required
                                />
                                {renderFieldError('username')}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={(form as any).email || ''}
                                    onChange={handleChange}
                                    required
                                />
                                {renderFieldError('email')}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Пароль</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={(form as any).password || ''}
                                    onChange={handleChange}
                                    required
                                />
                                {renderFieldError('password')}
                            </div>
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button
                        type="submit"
                        disabled={
                            registerMutation.isPending ||
                            updateMutation.isPending
                        }
                    >
                        {isEdit
                            ? updateMutation.isPending
                                ? 'Сохраняем...'
                                : 'Сохранить'
                            : registerMutation.isPending
                              ? 'Регистрация...'
                              : 'Зарегистрировать'}
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        Отмена
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

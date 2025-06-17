import { useState } from 'react';
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
    type RegisterParticipantInput,
    useRegisterParticipant,
} from '@/hooks/mutation/useParticipantsMutations.ts';

export default function ParticipantForm() {
    const [form, setForm] = useState<RegisterParticipantInput>({
        username: '',
        email: '',
        password: '',
        name: '',
        description: '',
    });

    const mutation = useRegisterParticipant(() => {
        setForm({
            username: '',
            email: '',
            password: '',
            name: '',
            description: '',
        });
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(form, {
            onError: (err) => {
                console.error('Ошибка регистрации:', err);
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Новый участник</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name">Имя участника</Label>
                        <Input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Описание</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full"
                    >
                        {mutation.isPending
                            ? 'Регистрация...'
                            : 'Зарегистрировать'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

import React, { useEffect, useRef, useState } from 'react';
import { ProductionPlanService } from '@/service/ProductionPlanService';
import type { createSupply, Supply, updateSupply } from '@/models/supply';
import { useSupplies } from '@/hooks/query/useSupplies';
import {
    useCreateSupply,
    useDeleteSupply,
    useUpdateSupply,
} from '@/hooks/mutation/useSuppliesMutations';
import { useCatalogs } from '@/hooks/query/useCatalogs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import PaginationBar from '@/components/PaginationBar';
import { useFormErrors } from '@/hooks/useFormErrors';

export default function ManageSuppliesPage() {
    const [isPlanFinalized, setIsPlanFinalized] = useState(false);
    const [page, setPage] = useState(0);
    const limit = 10;

    const [formVisible, setFormVisible] = useState(false);
    const [editingSupply, setEditingSupply] = useState<Supply | null>(null);
    const isEditingRef = useRef(false);

    const [consumerParticipant, setConsumerParticipant] = useState<string>('');
    const [providerParticipant, setProviderParticipant] = useState<string>('');
    const [consumerCatalogId, setConsumerCatalogId] = useState<string>('');
    const [providerCatalogId, setProviderCatalogId] = useState<string>('');
    const [costFactor, setCostFactor] = useState<number>(0);

    const { fieldErrors, handleError, resetErrors } = useFormErrors(true);
    const { items: catalogs, isLoading: isCatalogsLoading } = useCatalogs();
    const {
        items: supplies,
        count,
        isLoading: isSuppliesLoading,
    } = useSupplies(page, limit);

    const createSupply = useCreateSupply(() => closeForm());
    const updateSupply = useUpdateSupply(() => closeForm());
    const deleteSupply = useDeleteSupply(() => {
        if (page * limit >= count - 1 && page > 0) setPage((p) => p - 1);
    });

    useEffect(() => {
        if (editingSupply) {
            setConsumerParticipant(
                editingSupply.consumer_catalog.product.participant_name,
            );
            setProviderParticipant(
                editingSupply.supplier_catalog.product.participant_name,
            );
            setConsumerCatalogId(editingSupply.consumer_catalog.id.toString());
            setProviderCatalogId(editingSupply.supplier_catalog.id.toString());
        }
    }, [editingSupply]);

    useEffect(() => {
        new ProductionPlanService()
            .getActualityProductionPlan()
            .then((plan) => setIsPlanFinalized(plan.status === 'FINALIZED'));
    }, []);

    const getParticipants = () => {
        const names = catalogs
            .map((c) => (c.product.participant_name ?? '').trim())
            .filter(Boolean);
        return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
    };

    const getCatalogsForParticipant = (participantName: string) => {
        if (!participantName) return [];
        return catalogs.filter(
            (c) =>
                (c.product.participant_name ?? '').trim() === participantName,
        );
    };

    const closeForm = () => {
        setFormVisible(false);
        setEditingSupply(null);
        setConsumerParticipant('');
        setProviderParticipant('');
        setConsumerCatalogId('');
        setProviderCatalogId('');
        setCostFactor(0);
        resetErrors();
        isEditingRef.current = false;
    };

    const openAddForm = () => {
        closeForm();
        setFormVisible(true);
    };

    const openEditForm = (supply: Supply) => {
        setEditingSupply(supply);
        setConsumerParticipant(
            supply.consumer_catalog.product.participant_name ?? '',
        );
        setProviderParticipant(
            supply.supplier_catalog.product.participant_name ?? '',
        );
        setConsumerCatalogId(supply.consumer_catalog.id.toString() ?? '');
        setProviderCatalogId(supply.supplier_catalog.id.toString() ?? '');
        setCostFactor(supply.cost_factor);
        resetErrors();
        setFormVisible(true);
        isEditingRef.current = true;
    };

    const handleConsumerParticipantChange = (value: string) => {
        setConsumerParticipant(value);
        if (!isEditingRef.current) {
            setConsumerCatalogId('');
        }
    };

    const handleProviderParticipantChange = (value: string) => {
        setProviderParticipant(value);
        if (!isEditingRef.current) {
            setProviderCatalogId('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        resetErrors();

        const payload: createSupply = {
            consumer_catalog_id: +consumerCatalogId,
            supplier_catalog_id: +providerCatalogId,
            cost_factor: costFactor,
        };

        if (editingSupply) {
            updateSupply.mutate(
                { id: editingSupply.id, dto: payload as updateSupply },
                { onError: handleError },
            );
        } else {
            createSupply.mutate(payload, { onError: handleError });
        }
    };

    const isFormDisabled =
        isPlanFinalized ||
        createSupply.isPending ||
        updateSupply.isPending ||
        isCatalogsLoading;

    const participants = getParticipants();
    const consumerCatalogs = getCatalogsForParticipant(consumerParticipant);
    const providerCatalogs = getCatalogsForParticipant(providerParticipant);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-extrabold">Поставки</h1>
                <Button onClick={openAddForm} disabled={isPlanFinalized}>
                    Добавить поставку
                </Button>
            </div>

            {isPlanFinalized && (
                <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent>
                        <p className="text-yellow-800">
                            План уже рассчитан. Изменения невозможны.
                        </p>
                    </CardContent>
                </Card>
            )}

            {formVisible && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {editingSupply
                                ? 'Редактировать поставку'
                                : 'Создать поставку'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {/* ПОТРЕБИТЕЛЬ - УЧАСТНИК */}
                            <div className="space-y-2">
                                <Label>Потребитель — Участник</Label>
                                <Select
                                    value={consumerParticipant}
                                    onValueChange={
                                        handleConsumerParticipantChange
                                    }
                                    disabled={!!editingSupply || isFormDisabled}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите участника" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {participants.map((p) => (
                                            <SelectItem key={p} value={p}>
                                                {p}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editingSupply && (
                                    <p className="text-xs text-muted-foreground">
                                        Участника нельзя изменить при
                                        редактировании.
                                    </p>
                                )}
                            </div>

                            {/* ПОТРЕБИТЕЛЬ - КАТАЛОГ */}
                            <div className="space-y-2">
                                <Label>Потребитель — Каталог</Label>
                                <Select
                                    value={String(consumerCatalogId)}
                                    onValueChange={setConsumerCatalogId}
                                    disabled={
                                        !consumerParticipant || isFormDisabled
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Сначала выберите участника" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {consumerCatalogs.map((c) => (
                                            <SelectItem
                                                key={c.id}
                                                value={c.id.toString()}
                                            >
                                                {c.product.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* ПОСТАВЩИК - УЧАСТНИК */}
                            <div className="space-y-2">
                                <Label>Поставщик — Участник</Label>
                                <Select
                                    value={providerParticipant}
                                    onValueChange={
                                        handleProviderParticipantChange
                                    }
                                    disabled={!!editingSupply || isFormDisabled}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите участника" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {participants.map((p) => (
                                            <SelectItem key={p} value={p}>
                                                {p}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* ПОСТАВЩИК - КАТАЛОГ */}
                            <div className="space-y-2">
                                <Label>Поставщик — Каталог</Label>
                                <Select
                                    value={providerCatalogId}
                                    onValueChange={setProviderCatalogId}
                                    disabled={
                                        !providerParticipant || isFormDisabled
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Сначала выберите участника" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {providerCatalogs.map((c) => (
                                            <SelectItem
                                                key={c.id}
                                                value={c.id.toString()}
                                            >
                                                {c.product.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* КОЭФФИЦИЕНТ ЗАТРАТ */}
                            <div className="space-y-2">
                                <Label>Коэффициент затрат</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={costFactor}
                                    onChange={(e) =>
                                        setCostFactor(Number(e.target.value))
                                    }
                                    disabled={isFormDisabled}
                                />
                                {fieldErrors.cost_factor && (
                                    <ul className="text-sm text-red-500 list-disc ml-4">
                                        {fieldErrors.cost_factor.map(
                                            (err, i) => (
                                                <li key={i}>{err}</li>
                                            ),
                                        )}
                                    </ul>
                                )}
                            </div>

                            {/* КНОПКИ */}
                            <div className="flex items-end gap-2">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={
                                        isFormDisabled ||
                                        !consumerCatalogId ||
                                        !providerCatalogId ||
                                        !costFactor
                                    }
                                >
                                    {editingSupply
                                        ? updateSupply.isPending
                                            ? 'Сохраняем...'
                                            : 'Сохранить'
                                        : createSupply.isPending
                                          ? 'Создаём...'
                                          : 'Создать'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={closeForm}
                                >
                                    Отмена
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* ТАБЛИЦА ПОСТАВОК */}
            <Card>
                <CardHeader>
                    <CardTitle>Список поставок</CardTitle>
                </CardHeader>
                <CardContent>
                    {isSuppliesLoading ? (
                        <p>Загрузка...</p>
                    ) : supplies.length === 0 ? (
                        <p className="text-gray-500">Поставки отсутствуют.</p>
                    ) : (
                        <div className="overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Потребитель</TableHead>
                                        <TableHead>Поставщик</TableHead>
                                        <TableHead>Коэфф.</TableHead>
                                        <TableHead>Действия</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {supplies.map((s) => (
                                        <TableRow key={s.id}>
                                            <TableCell>
                                                {
                                                    s.consumer_catalog.product
                                                        .participant_name
                                                }{' '}
                                                —{' '}
                                                {
                                                    s.consumer_catalog.product
                                                        .name
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    s.supplier_catalog.product
                                                        .participant_name
                                                }{' '}
                                                —{' '}
                                                {
                                                    s.supplier_catalog.product
                                                        .name
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {s.cost_factor}
                                            </TableCell>
                                            <TableCell className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        openEditForm(s)
                                                    }
                                                    disabled={isPlanFinalized}
                                                >
                                                    Редактировать
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        deleteSupply.mutate(
                                                            s.id,
                                                        )
                                                    }
                                                    disabled={isPlanFinalized}
                                                >
                                                    Удалить
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {!isSuppliesLoading && supplies.length > 0 && (
                        <div className="mt-4 flex justify-center">
                            <PaginationBar
                                page={page}
                                totalPages={Math.ceil(count / limit)}
                                onChangePage={setPage}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

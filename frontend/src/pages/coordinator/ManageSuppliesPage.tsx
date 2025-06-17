import React, { useEffect, useState, useMemo } from 'react';
import { ProductionPlanService } from '@/service/ProductionPlanService';
import type { createSupply, Supply } from '@/models/supply';
import { useSupplies } from '@/hooks/query/useSupplies.ts';
import {
    useCreateSupply,
    useDeleteSupply,
} from '@/hooks/mutation/useSuppliesMutations.ts';
import { useCatalogs } from '@/hooks/query/useCatalogs.ts';
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
import { PaginationBar } from '@/components/PaginationBar.tsx';

export default function ManageSuppliesPage() {
    const [isPlanFinalized, setIsPlanFinalized] = useState(false);
    const [page, setPage] = useState(0);
    const limit = 10;

    useEffect(() => {
        new ProductionPlanService()
            .getActualityProductionPlan()
            .then((plan) => setIsPlanFinalized(plan.status === 'FINALIZED'));
    }, []);

    const {
        items: supplies,
        count,
        isLoading: isSuppliesLoading,
    } = useSupplies(page, limit);
    const createSupply = useCreateSupply(() => resetForm());
    const deleteSupply = useDeleteSupply(() => {
        if (page * limit >= count - 1 && page > 0) setPage((p) => p - 1);
    });

    const { items: catalogs, isLoading: isCatalogsLoading } = useCatalogs();
    const participants = useMemo(
        () => Array.from(new Set(catalogs.map((c) => c.participant))),
        [catalogs],
    );

    const [consumerPart, setConsumerPart] = useState('');
    const [providerPart, setProviderPart] = useState('');
    const [consumerCatalogId, setConsumerCatalogId] = useState('');
    const [providerCatalogId, setProviderCatalogId] = useState('');
    const [costFactor, setCostFactor] = useState('');

    const consumerCatalogs = useMemo(
        () =>
            catalogs.filter(
                (c) =>
                    c.participant === consumerPart &&
                    c.id.toString() !== providerCatalogId,
            ),
        [catalogs, consumerPart, providerCatalogId],
    );
    const providerCatalogs = useMemo(
        () =>
            catalogs.filter(
                (c) =>
                    c.participant === providerPart &&
                    c.id.toString() !== consumerCatalogId,
            ),
        [catalogs, providerPart, consumerCatalogId],
    );

    const resetForm = () => {
        setConsumerPart('');
        setProviderPart('');
        setConsumerCatalogId('');
        setProviderCatalogId('');
        setCostFactor('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: createSupply = {
            consumer_catalog_id: +consumerCatalogId,
            supplier_catalog_id: +providerCatalogId,
            cost_factor: parseFloat(costFactor),
        };
        createSupply.mutate(payload);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold">Управление поставками</h1>

            {isPlanFinalized && (
                <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent>
                        <p className="text-yellow-800">
                            План уже рассчитан. Изменения невозможны.
                        </p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Создать поставку</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <div className={'space-y-2'}>
                            <Label>Потребитель — Участник</Label>
                            <Select
                                value={consumerPart}
                                onValueChange={(v) => {
                                    setConsumerPart(v);
                                    setConsumerCatalogId('');
                                }}
                                disabled={isPlanFinalized || isCatalogsLoading}
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

                        <div className={'space-y-2'}>
                            <Label>Поставщик — Участник</Label>
                            <Select
                                value={providerPart}
                                onValueChange={(v) => {
                                    setProviderPart(v);
                                    setProviderCatalogId('');
                                }}
                                disabled={isPlanFinalized || isCatalogsLoading}
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

                        <div className={'space-y-2'}>
                            <Label>Потребитель — Каталог</Label>
                            <Select
                                value={consumerCatalogId}
                                onValueChange={setConsumerCatalogId}
                                disabled={
                                    !consumerPart ||
                                    isPlanFinalized ||
                                    isCatalogsLoading
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Сначала участник" />
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

                        <div className={'space-y-2'}>
                            <Label>Поставщик — Каталог</Label>
                            <Select
                                value={providerCatalogId}
                                onValueChange={setProviderCatalogId}
                                disabled={
                                    !providerPart ||
                                    isPlanFinalized ||
                                    isCatalogsLoading
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Сначала участник" />
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

                        <div className={'space-y-2'}>
                            <Label>Коэффициент затрат</Label>
                            <Input
                                type="number"
                                step="0.01"
                                required
                                value={costFactor}
                                onChange={(e) => setCostFactor(e.target.value)}
                                disabled={isPlanFinalized}
                                placeholder="например, 1.5"
                            />
                        </div>

                        <div className="flex items-end">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={
                                    isPlanFinalized ||
                                    createSupply.isPending ||
                                    !consumerCatalogId ||
                                    !providerCatalogId ||
                                    !costFactor
                                }
                            >
                                {createSupply.isPending
                                    ? 'Сохраняем...'
                                    : 'Создать'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

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
                                    {supplies.map((s: Supply) => (
                                        <TableRow key={s.id}>
                                            <TableCell>
                                                {s.consumer_catalog.participant}{' '}
                                                —{' '}
                                                {
                                                    s.consumer_catalog.product
                                                        .name
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {s.supplier_catalog.participant}{' '}
                                                —{' '}
                                                {
                                                    s.supplier_catalog.product
                                                        .name
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {s.cost_factor}
                                            </TableCell>
                                            <TableCell>
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
                                setPage={setPage}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

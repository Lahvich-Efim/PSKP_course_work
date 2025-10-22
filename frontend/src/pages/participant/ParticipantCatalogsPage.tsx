import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useProductionPlanMeta } from '@/hooks/query/useProductionPlan';
import { useProducts } from '@/hooks/query/useProducts';
import PaginationBar from '@/components/PaginationBar.tsx';
import {
    useCreateCatalog,
    useUpdateCatalog,
    useDeleteCatalog,
} from '@/hooks/mutation/useCatalogsMutations.ts';
import { useCatalogs } from '@/hooks/query/useCatalogs.ts';
import { Select } from '@radix-ui/react-select';
import {
    SelectTrigger,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { SelectValue } from '@/components/ui/select.tsx';
import type { Catalog } from '@/models/catalog.ts';
import { useFormErrors } from '@/hooks/useFormErrors.ts';

export default function ParticipantCatalogsPage() {
    const pageSize = 5;
    const [page, setPage] = useState(0);

    const { data: meta } = useProductionPlanMeta();
    const isFinalized = meta?.status === 'FINALIZED';

    const { items: products } = useProducts(0, 100, !isFinalized);
    const { items: catalogs, count, refetch } = useCatalogs(page, pageSize);
    const { fieldErrors, handleError, resetErrors } = useFormErrors(true);

    const createCatalog = useCreateCatalog(() => refetch());
    const updateCatalog = useUpdateCatalog(() => refetch());
    const deleteCatalog = useDeleteCatalog(() => refetch());

    // ---- состояния формы ----
    const [editingCatalog, setEditingCatalog] = useState<null | Catalog>(null);
    const [formVisible, setFormVisible] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [volume, setVolume] = useState('0.0');

    const handleAddClick = () => {
        setEditingCatalog(null);
        setSelectedProductId('');
        setVolume('0.0');
        setFormVisible(true);
    };

    const handleEdit = (c: Catalog) => {
        setEditingCatalog(c);
        setSelectedProductId(String(c.product.id));
        setVolume(String(c.desired_volume));
        setFormVisible(true);
    };

    const handleFormClose = () => {
        setEditingCatalog(null);
        setSelectedProductId('');
        setVolume('0.0');
        setFormVisible(false);
    };

    const handleSave = () => {
        const pid = parseInt(selectedProductId);
        const vol = parseFloat(volume);
        if (!pid || isNaN(vol)) return;
        resetErrors();

        if (editingCatalog) {
            updateCatalog.mutate(
                { id: editingCatalog.id, data: { desired_volume: vol } },
                { onError: handleError },
            );
        } else {
            createCatalog.mutate(
                { product_id: pid, desired_volume: vol },
                { onError: handleError },
            );
        }

        handleFormClose();
    };

    const handleDelete = (id: number) => {
        if (!confirm('Удалить каталог?')) return;
        resetErrors();
        deleteCatalog.mutate(id, { onError: handleError });
    };

    const renderFieldError = (field: string) =>
        fieldErrors[field] ? (
            <ul className="text-sm text-red-500 list-disc ml-4 break-words">
                {fieldErrors[field]?.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
        ) : null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold">Каталоги</h1>
                {(editingCatalog || !formVisible) && !isFinalized && (
                    <Button onClick={handleAddClick}>Добавить каталог</Button>
                )}
            </div>

            {formVisible && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>
                            {editingCatalog
                                ? 'Редактирование каталога'
                                : 'Новый каталог'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Продукт</Label>
                                <Select
                                    value={selectedProductId}
                                    onValueChange={setSelectedProductId}
                                    disabled={
                                        isFinalized || editingCatalog !== null
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите продукт" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((p) => (
                                            <SelectItem
                                                key={p.id}
                                                value={String(p.id)}
                                            >
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Желаемый объём</Label>
                                <Input
                                    type="number"
                                    value={volume}
                                    onChange={(e) => setVolume(e.target.value)}
                                    disabled={isFinalized}
                                />
                                {renderFieldError('desired_volume')}
                            </div>

                            <div className="flex items-end space-x-2">
                                <Button
                                    onClick={handleSave}
                                    disabled={
                                        isFinalized ||
                                        createCatalog.isPending ||
                                        updateCatalog.isPending
                                    }
                                >
                                    {createCatalog.isPending ||
                                    updateCatalog.isPending
                                        ? 'Сохраняем...'
                                        : 'Сохранить'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleFormClose}
                                    disabled={
                                        isFinalized ||
                                        createCatalog.isPending ||
                                        updateCatalog.isPending
                                    }
                                >
                                    Отмена
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Table className="table-fixed w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>Продукт</TableHead>
                        <TableHead>Объём</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {catalogs.map((c) => (
                        <TableRow key={c.id}>
                            <TableCell>{c.product.name}</TableCell>
                            <TableCell>{`${c.desired_volume} ${c.product.unit}`}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button
                                    size="sm"
                                    onClick={() => handleEdit(c)}
                                    disabled={isFinalized}
                                >
                                    Ред.
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(c.id)}
                                    disabled={
                                        isFinalized || deleteCatalog.isPending
                                    }
                                >
                                    Удалить
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="mt-4 flex justify-center">
                <PaginationBar
                    page={page}
                    totalPages={Math.ceil(count / pageSize)}
                    onChangePage={setPage}
                />
            </div>
        </div>
    );
}

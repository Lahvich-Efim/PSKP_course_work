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
import {
    useCreateProduct,
    useUpdateProduct,
    useDeleteProduct,
} from '@/hooks/mutation/useProductsMutations';
import PaginationBar from '@/components/PaginationBar.tsx';
import type { Product } from '@/models/product';
import { useFormErrors } from '@/hooks/useFormErrors.ts';

export default function ProductManagementPage() {
    const pageSize = 10;
    const [page, setPage] = useState(0);

    const { data: meta } = useProductionPlanMeta();
    const isFinalized = meta?.status === 'FINALIZED';

    const { items: products, count, refetch } = useProducts(page, pageSize);
    const createProduct = useCreateProduct(() => refetch());
    const updateProduct = useUpdateProduct(() => refetch());
    const deleteProduct = useDeleteProduct(() => refetch());
    const { fieldErrors, handleError, resetErrors } = useFormErrors(true);

    // ---- состояния формы ----
    const [editingProduct, setEditingProduct] = useState<null | Product>(null);
    const [formVisible, setFormVisible] = useState(false);
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('');

    const handleAddClick = () => {
        setEditingProduct(null);
        setName('');
        setUnit('');
        setFormVisible(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setName(product.name);
        setUnit(product.unit);
        setFormVisible(true);
    };

    const handleFormClose = () => {
        setEditingProduct(null);
        setName('');
        setUnit('');
        setFormVisible(false);
    };

    const handleSave = () => {
        if (!name || !unit) return;
        resetErrors();

        if (editingProduct) {
            updateProduct.mutate(
                { id: editingProduct.id, dto: { name, unit } },
                { onError: handleError },
            );
        } else {
            createProduct.mutate({ name, unit }, { onError: handleError });
        }

        handleFormClose();
    };

    const handleDelete = (id: number) => {
        if (!confirm('Удалить продукт?')) return;
        resetErrors();
        deleteProduct.mutate(id, { onError: handleError });
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
                <h1 className="text-3xl font-extrabold">Продукты</h1>
                {(editingProduct || !formVisible) && !isFinalized && (
                    <Button onClick={handleAddClick}>Добавить продукт</Button>
                )}
            </div>

            {formVisible && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>
                            {editingProduct
                                ? 'Редактирование продукта'
                                : 'Новый продукт'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Название</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={
                                        isFinalized ||
                                        createProduct.isPending ||
                                        updateProduct.isPending
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Единица</Label>
                                <Input
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    disabled={
                                        isFinalized ||
                                        createProduct.isPending ||
                                        updateProduct.isPending
                                    }
                                />
                                {renderFieldError('unit')}
                            </div>
                            <div className="flex items-end space-x-2">
                                <Button
                                    onClick={handleSave}
                                    disabled={
                                        isFinalized ||
                                        createProduct.isPending ||
                                        updateProduct.isPending
                                    }
                                >
                                    {createProduct.isPending ||
                                    updateProduct.isPending
                                        ? 'Сохраняем...'
                                        : 'Сохранить'}
                                </Button>
                                <Button
                                    onClick={handleFormClose}
                                    variant="outline"
                                    disabled={
                                        isFinalized ||
                                        createProduct.isPending ||
                                        updateProduct.isPending
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
                        <TableHead>Название</TableHead>
                        <TableHead>Единица</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{p.unit}</TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button
                                    size="sm"
                                    onClick={() => handleEdit(p)}
                                    disabled={isFinalized}
                                >
                                    Ред.
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(p.id)}
                                    disabled={
                                        isFinalized || deleteProduct.isPending
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

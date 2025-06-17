import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { PaginationBar } from '@/components/PaginationBar.tsx';
import type { Product } from '@/models/product';

export default function ParticipantProductsPage() {
    const pageSize = 10;
    const [page, setPage] = useState(0);
    const { data: meta } = useProductionPlanMeta();
    const isFinalized = meta?.status === 'FINALIZED';

    const { items: products, count, refetch } = useProducts(page, pageSize);
    const createProduct = useCreateProduct(() => refetch());
    const updateProduct = useUpdateProduct(() => refetch());
    const deleteProduct = useDeleteProduct(() => refetch());

    const [newName, setNewName] = useState('');
    const [newUnit, setNewUnit] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editUnit, setEditUnit] = useState('');

    const startEdit = (p: Product) => {
        setEditingId(p.id);
        setEditName(p.name);
        setEditUnit(p.unit);
    };
    const cancelEdit = () => setEditingId(null);

    const saveNew = () => {
        if (!newName || !newUnit) return;
        createProduct.mutate({ name: newName, unit: newUnit });
        setNewName('');
        setNewUnit('');
    };

    const saveEdit = (id: number) => {
        if (!editName || !editUnit) return;
        updateProduct.mutate({ id, dto: { name: editName, unit: editUnit } });
        setEditingId(null);
    };

    const remove = (id: number) => {
        if (!confirm('Удалить продукт?')) return;
        deleteProduct.mutate(id);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Управление продуктами</h1>
            {isFinalized && (
                <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent>
                        <p className="text-yellow-800">
                            План завершен — редактирование недоступно
                        </p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Создание продукта</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Название</Label>
                            <Input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                disabled={
                                    isFinalized || createProduct.isPending
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Единица</Label>
                            <Input
                                value={newUnit}
                                onChange={(e) => setNewUnit(e.target.value)}
                                disabled={
                                    isFinalized || createProduct.isPending
                                }
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                onClick={saveNew}
                                disabled={
                                    isFinalized || createProduct.isPending
                                }
                            >
                                {createProduct.isPending
                                    ? 'Сохраняем...'
                                    : 'Добавить'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Список продуктов</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table className="table-fixed w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Название</TableHead>
                                <TableHead>Единица</TableHead>
                                <TableHead className="text-right">
                                    Действия
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        {editingId === p.id ? (
                                            <Input
                                                value={editName}
                                                onChange={(e) =>
                                                    setEditName(e.target.value)
                                                }
                                                disabled={
                                                    isFinalized ||
                                                    updateProduct.isPending
                                                }
                                            />
                                        ) : (
                                            p.name
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingId === p.id ? (
                                            <Input
                                                value={editUnit}
                                                onChange={(e) =>
                                                    setEditUnit(e.target.value)
                                                }
                                                disabled={
                                                    isFinalized ||
                                                    updateProduct.isPending
                                                }
                                            />
                                        ) : (
                                            p.unit
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {editingId === p.id ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        saveEdit(p.id)
                                                    }
                                                    disabled={
                                                        isFinalized ||
                                                        updateProduct.isPending
                                                    }
                                                >
                                                    {updateProduct.isPending
                                                        ? 'Сохр...'
                                                        : 'Сохранить'}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={cancelEdit}
                                                    disabled={
                                                        isFinalized ||
                                                        updateProduct.isPending
                                                    }
                                                >
                                                    Отмена
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() => startEdit(p)}
                                                    disabled={isFinalized}
                                                >
                                                    Ред.
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => remove(p.id)}
                                                    disabled={
                                                        isFinalized ||
                                                        deleteProduct.isPending
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
                            totalPages={Math.ceil(count / pageSize)}
                            setPage={(fn) =>
                                setPage((prev) =>
                                    typeof fn === 'function' ? fn(prev) : fn,
                                )
                            }
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

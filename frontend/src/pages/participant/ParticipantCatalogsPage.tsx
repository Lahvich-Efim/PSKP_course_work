import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
    Table,
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useProductionPlanMeta } from '@/hooks/query/useProductionPlan';
import { useCatalogs } from '@/hooks/query/useCatalogs';
import {
    useCreateCatalog,
    useUpdateCatalog,
    useDeleteCatalog,
} from '@/hooks/mutation/useCatalogsMutations';
import { PaginationBar } from '@/components/PaginationBar';
import type { Catalog } from '@/models/catalog';
import { useProducts } from '@/hooks/query/useProducts';

export default function ParticipantCatalogsPage() {
    const pageSize = 5;
    const [page, setPage] = useState(0);
    const { data: meta } = useProductionPlanMeta();
    const isFinalized = meta?.status === 'FINALIZED';

    const { items: products } = useProducts(0, 100, !isFinalized);
    const { items: catalogs, count, refetch } = useCatalogs(page, pageSize);

    const createCatalog = useCreateCatalog(() => refetch());
    const updateCatalog = useUpdateCatalog(() => refetch());
    const deleteCatalog = useDeleteCatalog(() => refetch());

    const [form, setForm] = useState<{
        id?: number;
        productId: string;
        volume: string;
    }>({ productId: '', volume: '' });

    const startEdit = (c: Catalog) => {
        setForm({
            id: c.id,
            productId: String(c.product.id),
            volume: String(c.desired_volume),
        });
    };
    const cancelEdit = () => setForm({ productId: '', volume: '' });

    const save = () => {
        const vol = parseFloat(form.volume);
        if (!form.productId || isNaN(vol)) return;
        if (form.id) {
            updateCatalog.mutate({
                id: form.id,
                data: { desired_volume: vol },
            });
        } else {
            createCatalog.mutate({
                product_id: +form.productId,
                desired_volume: vol,
            });
        }
        cancelEdit();
    };
    const remove = (id: number) => {
        if (confirm('Удалить каталог?')) deleteCatalog.mutate(id);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Управление каталогами</h1>
            {isFinalized && (
                <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent>
                        <p className="text-yellow-800">
                            План завершен — изменения запрещены
                        </p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>
                        {form.id ? 'Редактировать каталог' : 'Добавить каталог'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Продукт</Label>
                            <Select
                                value={form.productId}
                                onValueChange={(v) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        productId: v,
                                    }))
                                }
                                disabled={isFinalized || !!form.id}
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
                            <Label>Желаемый объем</Label>
                            <Input
                                type="number"
                                value={form.volume}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        volume: e.target.value,
                                    }))
                                }
                                disabled={isFinalized}
                            />
                        </div>
                        <div className="flex items-end space-x-2">
                            <Button onClick={save} disabled={isFinalized}>
                                {form.id ? 'Сохранить' : 'Добавить'}
                            </Button>
                            {form.id && (
                                <Button
                                    variant="outline"
                                    onClick={cancelEdit}
                                    disabled={isFinalized}
                                >
                                    Отмена
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Список каталогов</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table className="table-fixed w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Продукт</TableHead>
                                <TableHead>Объем</TableHead>
                                <TableHead className="text-right">
                                    Действия
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {catalogs.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>{c.product.name}</TableCell>
                                    <TableCell>
                                        {c.desired_volume} {c.product.unit}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            size="sm"
                                            onClick={() => startEdit(c)}
                                            disabled={isFinalized}
                                        >
                                            Ред.
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => remove(c.id)}
                                            disabled={isFinalized}
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

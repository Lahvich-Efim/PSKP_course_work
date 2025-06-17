import React, { useState } from 'react';
import {
    useProductionPlanMeta,
    useProductionPlanCatalogs,
} from '@/hooks/query/useProductionPlan';
import {
    useCreateProductionPlan,
    useCalculateProductionPlan,
} from '@/hooks/mutation/useProductionPlanMutations';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/accordion';
import {
    Table,
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { PaginationBar } from '@/components/PaginationBar';

export default function CoordinatorDashboardPage() {
    const pageSize = 10;
    const [page, setPage] = useState(0);

    const { data: meta, isLoading: metaLoading } = useProductionPlanMeta();
    const { data: catalogData, isLoading: catalogsLoading } =
        useProductionPlanCatalogs(page, pageSize);

    const getFinal = (cat: (typeof catalogData.items)[0]) =>
        (cat.supplies || []).reduce(
            (sum, s) =>
                s.direction === 'outgoing' ? sum + (s.final_amount ?? 0) : sum,
            0,
        );

    const createPlan = useCreateProductionPlan();
    const calculatePlan = useCalculateProductionPlan();

    const handleCreate = () => createPlan.mutate({ period: Date.now() });
    const handleCalculate = () => calculatePlan.mutate();

    const isFinalized = meta?.status === 'FINALIZED';

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold mb-6">План производства</h1>

            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">
                        Текущий план
                    </CardTitle>
                    <div className="flex space-x-2">
                        <Button
                            size="sm"
                            onClick={handleCreate}
                            disabled={
                                createPlan.isPending || meta?.status === 'OPEN'
                            }
                        >
                            {createPlan.isPending
                                ? 'Создание...'
                                : 'Новый план'}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCalculate}
                            disabled={
                                calculatePlan.isPending ||
                                meta?.status !== 'OPEN'
                            }
                        >
                            {calculatePlan.isPending
                                ? 'Расчёт...'
                                : 'Рассчитать'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {metaLoading ? (
                        <p>Загрузка...</p>
                    ) : meta ? (
                        <div className="space-y-1">
                            <p>
                                ID: <strong>{meta.id}</strong>
                            </p>
                            <p>
                                Период:{' '}
                                <strong>
                                    {new Date(meta.period).toLocaleDateString()}
                                </strong>
                            </p>
                            <p>
                                Статус:{' '}
                                <Badge
                                    variant={
                                        isFinalized ? 'secondary' : 'outline'
                                    }
                                    className="uppercase"
                                >
                                    {meta.status}
                                </Badge>
                            </p>
                        </div>
                    ) : (
                        <p>План не найден</p>
                    )}
                </CardContent>
            </Card>

            {meta && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">
                            Каталоги производства
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {catalogsLoading ? (
                            <p>Загрузка каталогов...</p>
                        ) : (
                            <Accordion
                                type="single"
                                collapsible
                                className="space-y-2"
                            >
                                {catalogData?.items.map((catalog) => {
                                    const totalProduced = getFinal(catalog);

                                    const incoming = catalog.supplies.filter(
                                        (s) => s.direction === 'incoming',
                                    );
                                    const outgoing = catalog.supplies.filter(
                                        (s) => s.direction === 'outgoing',
                                    );

                                    return (
                                        <AccordionItem
                                            key={catalog.id}
                                            value={catalog.id.toString()}
                                        >
                                            <AccordionTrigger className="flex justify-between">
                                                <div>
                                                    <div className="text-lg font-semibold">
                                                        {catalog.product.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {catalog.participant}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    {isFinalized ? (
                                                        <>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-sm"
                                                            >
                                                                Внешняя:{' '}
                                                                {
                                                                    catalog.desired_volume
                                                                }{' '}
                                                                {
                                                                    catalog
                                                                        .product
                                                                        .unit
                                                                }
                                                            </Badge>
                                                            <p>+</p>
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-sm"
                                                            >
                                                                Внутренняя:{' '}
                                                                {totalProduced}{' '}
                                                                {
                                                                    catalog
                                                                        .product
                                                                        .unit
                                                                }
                                                            </Badge>
                                                            <p>=</p>
                                                            <Badge
                                                                variant="default"
                                                                className="text-sm"
                                                            >
                                                                Итог:{' '}
                                                                {totalProduced +
                                                                    catalog.desired_volume}{' '}
                                                                {
                                                                    catalog
                                                                        .product
                                                                        .unit
                                                                }
                                                            </Badge>
                                                        </>
                                                    ) : (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-sm"
                                                        >
                                                            Ожидание расчета
                                                            плана...
                                                        </Badge>
                                                    )}
                                                </div>
                                            </AccordionTrigger>

                                            <AccordionContent>
                                                <div className="mb-4">
                                                    <p className="font-medium mb-1">
                                                        Поставщики
                                                    </p>
                                                    {incoming.length > 0 ? (
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>
                                                                        Участник
                                                                    </TableHead>
                                                                    <TableHead>
                                                                        Коэф.
                                                                        затрат
                                                                    </TableHead>
                                                                    <TableHead>
                                                                        Внутр.
                                                                        поставка
                                                                    </TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {incoming.map(
                                                                    (s) => (
                                                                        <TableRow
                                                                            key={
                                                                                s.id
                                                                            }
                                                                        >
                                                                            <TableCell>
                                                                                {
                                                                                    s
                                                                                        .peer_catalog
                                                                                        .participant
                                                                                }{' '}
                                                                                —{' '}
                                                                                {
                                                                                    s
                                                                                        .peer_catalog
                                                                                        .product
                                                                                        .name
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {
                                                                                    s.cost_factor
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {isFinalized
                                                                                    ? (s.final_amount ??
                                                                                      0)
                                                                                    : '(ожидание)'}{' '}
                                                                                {
                                                                                    s
                                                                                        .peer_catalog
                                                                                        .product
                                                                                        .unit
                                                                                }
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ),
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    ) : (
                                                        <p className="text-sm text-gray-500">
                                                            Нет поставщиков
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="font-medium mb-1">
                                                        Потребители
                                                    </p>
                                                    {outgoing.length > 0 ? (
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>
                                                                        Участник
                                                                    </TableHead>
                                                                    <TableHead>
                                                                        Коэф.
                                                                        затрат
                                                                    </TableHead>
                                                                    <TableHead>
                                                                        Внутр.
                                                                        поставка
                                                                    </TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {outgoing.map(
                                                                    (s) => (
                                                                        <TableRow
                                                                            key={
                                                                                s.id
                                                                            }
                                                                        >
                                                                            <TableCell>
                                                                                {
                                                                                    s
                                                                                        .peer_catalog
                                                                                        .participant
                                                                                }{' '}
                                                                                —{' '}
                                                                                {
                                                                                    s
                                                                                        .peer_catalog
                                                                                        .product
                                                                                        .name
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {
                                                                                    s.cost_factor
                                                                                }
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {isFinalized
                                                                                    ? (s.final_amount ??
                                                                                      0)
                                                                                    : '(ожидание)'}{' '}
                                                                                {
                                                                                    catalog
                                                                                        .product
                                                                                        .unit
                                                                                }
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ),
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    ) : (
                                                        <p className="text-sm text-gray-500">
                                                            Нет потребителей
                                                        </p>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        )}

                        {catalogData && (
                            <div className="mt-4 flex justify-center">
                                <PaginationBar
                                    page={page}
                                    totalPages={Math.ceil(
                                        catalogData.count / pageSize,
                                    )}
                                    setPage={(fn) =>
                                        setPage((prev) =>
                                            typeof fn === 'function'
                                                ? fn(prev)
                                                : fn,
                                        )
                                    }
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from '@/components/ui/table';
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
    useProductionPlanMeta,
    useProductionPlanCatalogs,
} from '@/hooks/query/useProductionPlan';
import { PaginationBar } from '@/components/PaginationBar';

export default function ParticipantDashboardPage() {
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const { data: meta, isLoading: metaLoading } = useProductionPlanMeta();
    const { data: catalogData, isLoading: catalogsLoading } =
        useProductionPlanCatalogs(page, pageSize);
    const catalogs = catalogData?.items ?? [];
    const total = catalogData?.count ?? 0;

    const isFinalized = meta?.status === 'FINALIZED';
    const getFinal = (cat: (typeof catalogs)[0]) =>
        (cat.supplies || []).reduce(
            (sum, s) =>
                s.direction === 'outgoing' ? sum + (s.final_amount ?? 0) : sum,
            0,
        );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold mb-6">План производства</h1>
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">
                        Текущий план
                    </CardTitle>
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
                                        meta.status === 'OPEN'
                                            ? 'outline'
                                            : 'secondary'
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
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">
                        Каталоги
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
                            {catalogs.map((cat) => {
                                const totalProduced = getFinal(cat);
                                return (
                                    <AccordionItem
                                        key={cat.id}
                                        value={String(cat.id)}
                                    >
                                        <AccordionTrigger className="flex justify-between items-center">
                                            <div className="text-lg font-semibold">
                                                {cat.product.name}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {isFinalized ? (
                                                    <>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-sm"
                                                        >
                                                            Внешняя:{' '}
                                                            {cat.desired_volume}{' '}
                                                            {cat.product.unit}
                                                        </Badge>
                                                        <p>+</p>
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-sm"
                                                        >
                                                            Внутренняя:{' '}
                                                            {totalProduced}{' '}
                                                            {cat.product.unit}
                                                        </Badge>
                                                        <p>=</p>
                                                        <Badge
                                                            variant="default"
                                                            className="text-sm"
                                                        >
                                                            Итог:{' '}
                                                            {totalProduced +
                                                                cat.desired_volume}{' '}
                                                            {cat.product.unit}
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
                                        {isFinalized && (
                                            <AccordionContent>
                                                {cat.supplies &&
                                                cat.supplies.length > 0 ? (
                                                    <Table className="w-full">
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>
                                                                    Роль
                                                                </TableHead>
                                                                <TableHead>
                                                                    Участник
                                                                </TableHead>
                                                                <TableHead>
                                                                    Продукт
                                                                </TableHead>
                                                                <TableHead>
                                                                    Коэфф.
                                                                </TableHead>
                                                                <TableHead>
                                                                    Внутр.
                                                                    поставка
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {cat.supplies.map(
                                                                (s) => (
                                                                    <TableRow
                                                                        key={
                                                                            s.id
                                                                        }
                                                                    >
                                                                        <TableCell>
                                                                            {s.direction ===
                                                                            'incoming'
                                                                                ? 'Потребление'
                                                                                : 'Поставка'}
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {
                                                                                s
                                                                                    .peer_catalog
                                                                                    .participant
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell>
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
                                                                            {s.final_amount ??
                                                                                0}{' '}
                                                                            {s.direction ===
                                                                            'incoming'
                                                                                ? cat
                                                                                      .product
                                                                                      .unit
                                                                                : s
                                                                                      .peer_catalog
                                                                                      .product
                                                                                      .unit}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ),
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                ) : (
                                                    <p className="text-sm text-gray-500">
                                                        Поставок нет
                                                    </p>
                                                )}
                                            </AccordionContent>
                                        )}
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <PaginationBar
                        page={page}
                        totalPages={Math.ceil(total / pageSize)}
                        setPage={(newPage) => setPage(newPage)}
                    />
                </CardFooter>
            </Card>
        </div>
    );
}

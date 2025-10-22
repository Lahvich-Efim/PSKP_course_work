import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useProductionPlan } from '@/hooks/query/useProductionPlan';
import PaginationBar from '@/components/PaginationBar';
import CatalogsList from '@/components/CatalogsList.tsx';

export default function ParticipantDashboardPage() {
    const [page, setPage] = useState(0);
    const pageSize = 10;

    const { data: plan, isLoading: planLoading } = useProductionPlan(
        page,
        pageSize,
    );
    const total = plan?.count ?? 0;

    const isFinalized = plan?.status === 'FINALIZED';
    const getFinal = (cat) =>
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
                    {planLoading ? (
                        <p>Загрузка...</p>
                    ) : plan ? (
                        <div className="space-y-1">
                            <p>
                                ID: <strong>{plan.id}</strong>
                            </p>
                            <p>
                                Период:{' '}
                                <strong>
                                    {new Date(
                                        plan.period,
                                    ).toLocaleDateString() + ' '}
                                    -
                                    {' ' +
                                        new Date(
                                            new Date().setDate(
                                                new Date(
                                                    plan.period,
                                                ).getDate() + 30,
                                            ),
                                        ).toLocaleDateString()}
                                </strong>
                            </p>
                            <p>
                                Статус:{' '}
                                <Badge
                                    variant={
                                        plan.status === 'OPEN'
                                            ? 'outline'
                                            : 'secondary'
                                    }
                                    className="uppercase"
                                >
                                    {plan.status}
                                </Badge>
                            </p>
                        </div>
                    ) : (
                        <p>План не найден</p>
                    )}
                </CardContent>
            </Card>
            {plan && (
                <Card>
                    <CardHeader className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold">
                            Каталоги
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {planLoading ? (
                            <p>Загрузка каталогов...</p>
                        ) : (
                            <CatalogsList
                                catalogs={plan.items}
                                isFinalized={isFinalized}
                                getFinal={getFinal}
                            />
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <PaginationBar
                            page={page}
                            totalPages={Math.ceil(total / pageSize)}
                            onChangePage={setPage}
                        />
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}

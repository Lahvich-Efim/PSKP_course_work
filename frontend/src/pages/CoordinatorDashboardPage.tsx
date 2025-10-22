import React, { useState } from 'react';
import { useProductionPlan } from '@/hooks/query/useProductionPlan';
import {
    useCreateProductionPlan,
    useCalculateProductionPlan,
} from '@/hooks/mutation/useProductionPlanMutations';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PaginationBar from '@/components/PaginationBar';
import CatalogsList from '@/components/CatalogsList.tsx';
import { useFormErrors } from '@/hooks/useFormErrors.ts';

export default function CoordinatorDashboardPage() {
    const pageSize = 10;
    const [page, setPage] = useState(0);

    const { data: plan, isLoading: planLoading } = useProductionPlan(
        page,
        pageSize,
    );

    const getFinal = (cat: (typeof plan.items)[0]) =>
        (cat.supplies || []).reduce(
            (sum, s) =>
                s.direction === 'outgoing' ? sum + (s.final_amount ?? 0) : sum,
            0,
        );

    const createPlan = useCreateProductionPlan();
    const calculatePlan = useCalculateProductionPlan();
    const { handleError, resetErrors } = useFormErrors(true);

    const handleCreate = () => {
        resetErrors();
        createPlan.mutate({ period: Date.now() }, { onError: handleError });
    };
    const handleCalculate = () => {
        calculatePlan.mutate(null, { onError: handleError });
    };

    const isFinalized = plan?.status === 'FINALIZED';
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
                                createPlan.isPending || plan?.status === 'OPEN'
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
                                plan?.status !== 'OPEN'
                            }
                        >
                            {calculatePlan.isPending
                                ? 'Расчёт...'
                                : 'Рассчитать'}
                        </Button>
                    </div>
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
                                        isFinalized ? 'secondary' : 'outline'
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
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">
                            Каталоги производства
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

                        <div className="mt-4 flex justify-center">
                            <PaginationBar
                                page={page}
                                totalPages={Math.ceil(plan.count / pageSize)}
                                onChangePage={setPage}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

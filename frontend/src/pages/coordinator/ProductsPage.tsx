import React, { useState } from 'react';
import {
    Table,
    TableHeader,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PaginationBar from '@/components/PaginationBar.tsx';
import { useProducts } from '@/hooks/query/useProducts.ts';

export default function ProductsPage() {
    const pageSize = 10;
    const [page, setPage] = useState(0);

    const { items: products, count } = useProducts(page, pageSize);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-extrabold">Продукты</h1>

            <Table className="table-fixed w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>Участник</TableHead>
                        <TableHead>Название</TableHead>
                        <TableHead>Единица</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell>{p.participant_name}</TableCell>
                            <TableCell>{p.name}</TableCell>
                            <TableCell>{p.unit}</TableCell>
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

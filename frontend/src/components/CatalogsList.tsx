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
import { Badge } from '@/components/ui/badge';
import type { CatalogWithSupplies } from '@/models/production_plan.ts';

type CatalogListProps = {
    catalogs: CatalogWithSupplies[];
    isFinalized: boolean;
    getFinal: (catalog: CatalogWithSupplies) => number;
};

const CatalogsList = ({
    catalogs,
    isFinalized,
    getFinal,
}: CatalogListProps) => {
    return (
        <Accordion type="single" collapsible className="space-y-2">
            {catalogs.map((catalog) => {
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
                                    {catalog.product.participant_name}
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                {isFinalized ? (
                                    <>
                                        <Badge
                                            variant="outline"
                                            className="text-sm"
                                        >
                                            Внешняя: {catalog.desired_volume}{' '}
                                            {catalog.product.unit}
                                        </Badge>
                                        <p>+</p>
                                        <Badge
                                            variant="secondary"
                                            className="text-sm"
                                        >
                                            Внутренняя: {totalProduced}{' '}
                                            {catalog.product.unit}
                                        </Badge>
                                        <p>=</p>
                                        <Badge
                                            variant="default"
                                            className="text-sm"
                                        >
                                            Итог:{' '}
                                            {totalProduced +
                                                catalog.desired_volume}{' '}
                                            {catalog.product.unit}
                                        </Badge>
                                    </>
                                ) : (
                                    <Badge
                                        variant="outline"
                                        className="text-sm"
                                    >
                                        Ожидание расчета плана...
                                    </Badge>
                                )}
                            </div>
                        </AccordionTrigger>

                        <AccordionContent>
                            <div className="mb-4">
                                <p className="font-medium mb-1">Поставщики</p>
                                {incoming.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Участник</TableHead>
                                                <TableHead>
                                                    Коэф. затрат
                                                </TableHead>
                                                <TableHead>
                                                    Внутр. поставка
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {incoming.map((s) => (
                                                <TableRow key={s.id}>
                                                    <TableCell>
                                                        {
                                                            s.peer_catalog
                                                                .product
                                                                .participant_name
                                                        }{' '}
                                                        —{' '}
                                                        {
                                                            s.peer_catalog
                                                                .product.name
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {s.cost_factor}
                                                    </TableCell>
                                                    <TableCell>
                                                        {isFinalized
                                                            ? (s.final_amount ??
                                                              0)
                                                            : '(ожидание)'}{' '}
                                                        {
                                                            s.peer_catalog
                                                                .product.unit
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        Нет поставщиков
                                    </p>
                                )}
                            </div>

                            <div>
                                <p className="font-medium mb-1">Потребители</p>
                                {outgoing.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Участник</TableHead>
                                                <TableHead>
                                                    Коэф. затрат
                                                </TableHead>
                                                <TableHead>
                                                    Внутр. поставка
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {outgoing.map((s) => (
                                                <TableRow key={s.id}>
                                                    <TableCell>
                                                        {
                                                            s.peer_catalog
                                                                .product
                                                                .participant_name
                                                        }{' '}
                                                        —{' '}
                                                        {
                                                            s.peer_catalog
                                                                .product.name
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {s.cost_factor}
                                                    </TableCell>
                                                    <TableCell>
                                                        {isFinalized
                                                            ? (s.final_amount ??
                                                              0)
                                                            : '(ожидание)'}{' '}
                                                        {catalog.product.unit}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
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
    );
};

export default CatalogsList;

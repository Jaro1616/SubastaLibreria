import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

import { FilmIcon } from "lucide-react";

export default function TableActiveAuctions({ auctions }) {
const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";
const navigate = useNavigate();

if (!auctions || auctions.length === 0) {
    return (
    <div className="p-6 text-center text-muted-foreground">
        No hay subastas activas.
    </div>
    );
}

return (
    <Table>
    <TableHeader className="bg-primary/50">
        <TableRow>
        <TableHead>Imagen</TableHead>
        <TableHead>Objeto</TableHead>
        <TableHead>Fecha inicio</TableHead>
        <TableHead>Fecha cierre estimado</TableHead>
        <TableHead>Precio base</TableHead>
        <TableHead>Incremento minimo</TableHead>
        <TableHead>Pujas</TableHead>
        <TableHead>Acciones</TableHead>
        </TableRow>
    </TableHeader>

    <TableBody>
        {auctions.map((auction) => (
        <TableRow key={auction.id} className="h-20">
            {/* Imagen */}
            <TableCell className="w-52 h-76">
            {auction.book?.imagen?.image_path ? (
                <img
                src={`${BASE_URL}/${auction.book.imagen.image_path}`}
                alt={auction.book.title}
                className="h-full w-full object-cover"
                />
            ) : (
                <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
                <FilmIcon className="h-8 w-8" />
                </div>
            )}
            </TableCell>

            {/* Objeto */}
            <TableCell className="text-lg font-medium">
            {auction.book?.title}
            </TableCell>

            {/* Fecha inicio */}
            <TableCell className="text-lg">
            {auction.start_date}
            </TableCell>

            {/* Fecha cierre */}
            <TableCell className="text-lg">
            {auction.end_date}
            </TableCell>

            {/* Precio base */}
            <TableCell className="text-lg">
            ₡ {auction.base_price}
            </TableCell>

            {/* Incremento mínimo */}
            <TableCell className="text-lg">
            ₡ {auction.min_increment}
            </TableCell>

            {/* Campo calculado obligatorio */}
            <TableCell className="text-lg font-semibold">
            {auction.pujas_realizadas}
            </TableCell>

            <TableCell>
                    <Button
                        type="button"
                        onClick={() => navigate(`/auction/detail/${auction.id}`)}
                        className="px-4 py-2 bg-accent text-white hover:bg-accent/90"
                    >
                        Detalle
                    </Button>
                </TableCell>
        </TableRow>
        ))}
    </TableBody>
    </Table>
);
}
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";

    import { FilmIcon } from "lucide-react";

    export default function TableClosedAuctions({ auctions }) {
    const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";

    if (!auctions || auctions.length === 0) {
        return (
        <div className="p-6 text-center text-muted-foreground">
            No hay subastas finalizadas.
        </div>
        );
    }

    return (
        <Table>
        <TableHeader className="bg-primary/50">
            <TableRow>
            <TableHead>Imagen</TableHead>
            <TableHead>Objeto</TableHead>
            <TableHead>Fecha cierre</TableHead>
            <TableHead>Pujas recibidas</TableHead>
            <TableHead>Estado final</TableHead>
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

                {/* Fecha cierre obligatoria */}
                <TableCell className="text-lg">
                {auction.end_date}
                </TableCell>

                {/* Campo calculado */}
                <TableCell className="text-lg font-semibold">
                {auction.pujas_realizadas}
                </TableCell>

                {/* Estado final obligatorio */}
                <TableCell className="text-lg">
                {auction.final_state || "Finalizada"}
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    );
}
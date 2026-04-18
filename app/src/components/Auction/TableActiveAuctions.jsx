import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuctionService from "@/services/AuctionService";
import PaymentService from "@/services/PaymentService";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
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

    async function CloseConfirmed(auction) {
    const ganadorId = auction?.highest_bid?.customer_id;
    const ganadorNombre = auction?.user_leading?.name || "Sin postores";
    const montoFinal = auction?.highest_bid?.amount || auction.base_price;

    try {
        await AuctionService.closeAuction(auction.id);

        if (ganadorId) {
            const paymentData = {
                auction_id: auction.id,
                customer_id: ganadorId,
                total: Number(montoFinal),
                status: "Pending" 
            };

            await PaymentService.createPayment(paymentData);
            console.log("Registro de pago creado como 'Pending'");
        }

        toast.success("¡Subasta finalizada!", {
            description: `🏆 Ganador: ${ganadorNombre} con ₡${Number(montoFinal).toLocaleString()}. El pago ha sido registrado como pendiente.`,
            duration: 5000,
        });

        setTimeout(() => window.location.reload(), 3000);

    } catch (err) {
        console.error("Error en el proceso de cierre/pago:", err);
        toast.error("Ocurrió un error al procesar el cierre de la subasta");
    }
}

function handleAction(auction) {
    const now = new Date();
    //const end = new Date(auction.end_date);
    const end = new Date(auction.end_date.replace(" ", "T"));

    if (now >= end) {
        CloseConfirmed(auction);
    } else {
        navigate(`/auction/dobid/${auction.id}`);
    }
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

            {/* Campo calculado */}
            <TableCell className="text-lg font-semibold">
            {auction.pujas_realizadas}
            </TableCell>

            <TableCell className="flex justify-start items-center gap-1">
                <Button
                    type="button"
                    onClick={() => navigate(`/auction/detail/${auction.id}`)}
                    className="w-20 h-20 flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-25"
                >
                    Detalle
                </Button>
                {/* <br /> <br /> */}
                <Button
                    type="button"
                    onClick={() => handleAction(auction)}
                    className="w-20 h-20 flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-25"
                >
                    Subasta
                </Button>
            </TableCell>
        </TableRow>
        ))}
    </TableBody>
    </Table>
);
}
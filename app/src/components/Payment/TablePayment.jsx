import { useNavigate } from "react-router-dom";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FilmIcon, HandCoins } from "lucide-react";
import PaymentService from "@/services/PaymentService";
import { useEffect, useState } from "react";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { EmptyState } from "../ui/custom/EmptyState";
import { toast } from "sonner";

// Headers de la tabla
//map = foreach
const paymentColumns = [
    { key: "auction", label: "Subasta" },
    { key: "user", label: "Usuario Comprador" },
    { key: "amount", label: "Monto" },
    { key: "date", label: "Fecha" },
    { key: "state", label: "Estado del Pago" },
    { key: "", label: "Acciones" },
];

export default function TablePayments() {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        const fetchData = async () => {
        try {
            const response = await PaymentService.getPayments();
            console.log(response)
            const result = response.data;
            console.log(result)
            if (result.success) {
                setPayments(result.data || []);
            } else {
                setError(result.message || "Error desconocido");
            }
        } catch (err) {
            setError(err.message || "Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
        };
        fetchData()

    }, []);

    async function Pay(id) {

        try {
            await PaymentService.payPayment(id);

            toast.success("¡Pago realizado correctamente!");

            setTimeout(() => {
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.error("Error al procesar el pago:", error);
            toast.error("No se pudo procesar el pago. Inténtalo de nuevo.");
        }
    }

    const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";

    if (loading) return <LoadingGrid type="grid" />; 
    if (error) return <ErrorAlert title="Error al cargar pagos" message={error} />; 
    if (payments.length === 0) 
    return <EmptyState message="No se encontraron pagos." />; 

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">
                    Listado de Pagos
                </h1>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-primary/50">
                        <TableRow>
                            {paymentColumns.map((col)=>( 
                                <TableHead key={col.key}  className="text-left font-semibold">
                                    {col.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.map((payment)=>( 
                            <TableRow key={payment.id} /*className="h-16" - ESTO ME SIRVE PARA HACER MÁS ANCHA LA CELDA*/>
                                <TableCell className="relative w-52 h-76">
                                {payment.auction.book.imagen?.image_path ? (
                                    <img
                                        src={`${BASE_URL}/${payment.auction.book.imagen.image_path}`}
                                        alt={payment.auction.book.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
                                        <FilmIcon className="h-1/2 w-1/2" />
                                    </div>
                                )} </TableCell>
                                <TableCell>{payment.auction.user_leading.name} </TableCell>
                                <TableCell>{payment.total} </TableCell>
                                <TableCell>{payment.auction.end_date} </TableCell>
                                <TableCell>{payment.status} </TableCell>

                                <TableCell className="flex justify-start items-center gap-1">
                                    <Button
                                        disabled={payment.status === "Cancelled"}
                                        type="button"
                                        onClick={() => Pay(payment.id)}
                                        className="w-20 h-20 flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-25"
                                    >
                                        <HandCoins className="h-6 w-6" />
                                        Pagar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>
            <Button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Regresar
            </Button>
        </div>
    );
}
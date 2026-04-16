import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorAlert } from "../../ui/custom/ErrorAlert";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
// Shadcn UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    CircleDollarSign,
    ReceiptText,
    BadgeCent,
    Activity,
    ChartLine,
    User,
    Clock,
    TableOfContents,
    ClipboardClock,
} from "lucide-react";
import { LoadingGrid } from '../../ui/custom/LoadingGrid';
import { EmptyState } from '../../ui/custom/EmptyState';
import AuctionService from "@/services/AuctionService";

export function DoBids() {
    const navigate = useNavigate();
    const { id } = useParams();
    const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
    const [auction, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    //PARA EL CONTADOR
    const [timeLeft, setTimeLeft] = useState("");


    /*** PARTE DE FORMULARIO ***/
    /*** Yup ***/
    const bidSchema = yup.object({
            increment: yup
            .number()
            .typeError('Solo números')
            .required('Incremento requerido')
            .moreThan(0, 'Debe ser mayor a 0')
    });

    /*** Form ***/
    const {
            control,
            handleSubmit,
            formState: { errors },
    } = useForm({
            defaultValues: {
            increment: 1
            },
            resolver: yupResolver(bidSchema)
    });

    //AQUI VA TODA LA LOGICA PARA HACER LA PUJA
    const onSubmit = async (data) => {
        try {
            const formattedData = {
            ...data,
            start_date: format(new Date(data.start_date), "yyyy-MM-dd HH:mm:ss"),
            end_date: format(new Date(data.end_date), "yyyy-MM-dd HH:mm:ss"),
            //status: "Active"
            };

            console.log("DATA FINAL:", formattedData);

            const response = await AuctionService.createAuction(formattedData);

            toast.success("Subasta creada correctamente");
            navigate("/auction/maintenance");

        } catch (err) {
            console.error(err);
            setError("Error al crear subasta");
        }
    };
    /*** PARTE DE FORMULARIO ***/


    //PARA EL CONTADOR DE TIEMPO RESTANTE
    useEffect(() => {
        if (!auction?.data?.end_date) return;

        const interval = setInterval(() => {
            const now = new Date();
            const end = new Date(auction.data.end_date);

            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft("Finalizada");
                clearInterval(interval);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [auction]);

    //CARGO LOS DATOS
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AuctionService.getAuctionById(id);
                // Si la petición es exitosa, se guardan los datos
                console.log(response.data)
                setData(response.data);
                if(!response.data.success){
                    setError(response.data.message)
                }
            } catch (err) {
                // Si el error no es por cancelación, se registra
                if (err.name !== "AbortError") setError(err.message);
            } finally {
                // Independientemente del resultado, se actualiza el loading
                setLoading(false);
            }
        };
        fetchData(id);
    }, [id]);    


    if (loading) return <LoadingGrid count={1} type="grid" />;
    if (error) return <ErrorAlert title="Error al cargar subastas" message={error} />;
    if (!auction || auction.data.length === 0)
        return <EmptyState message="No se encontraron subastas en esta tienda." />;
    return (
        <Card className="p-6 max-w-5xl mx-auto">  
            <h1 className="text-3xl font-bold tracking-tight">
            <CircleDollarSign className="inline-block mr-2" />
            Subasta
            </h1>
            {/* PREVIEW */}
            <Card className="p-5">
                <p><strong>Libro:</strong> {auction.data.book.title}</p>
                <p><strong>Descripción:</strong> {auction.data.book.description}</p>
                <p><strong>Vendedor:</strong> {auction.data.book.seller.name}</p>

                {auction.data.book.imagen && (
                    <img
                        src={BASE_URL + "/" + auction.data.book.imagen.image_path}
                        className="w-40 mt-2"
                    />
                )}
            </Card>
            
            <h1 className="text-3xl font-bold tracking-tight">
            <ReceiptText className="inline-block mr-2" />
            Información de la Subasta
            </h1>
            {/* Sección de los Detalles */}
            <div className="flex-1 space-y-6">
                <Card>
                    <CardContent className="p-6 space-y-6">
                            {/* CAMPOS */}
                            <div className="flex items-center gap-4">
                                <BadgeCent className="h-5 w-5 text-primary" />
                                <span className="font-semibold">Precio Base:</span>
                                <p className="text-muted-foreground">
                                    {auction.data.base_price}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Activity className="h-5 w-5 text-primary" />
                                <span className="font-semibold">Incremento Minimo:</span>
                                <p className="text-muted-foreground">
                                    {auction.data.min_increment}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <ChartLine className="h-5 w-5 text-primary" />
                                <span className="font-semibold">Puja Actual más alta:</span>
                                <p className="text-muted-foreground">
                                    {auction.data.highest_bid?.amount}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <User className="h-5 w-5 text-primary" />
                                <span className="font-semibold">Vendedor:</span>
                                <p className="text-muted-foreground">
                                    {auction.data.book.seller.name}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <Clock className="h-5 w-5 text-primary" />
                                <span className="font-semibold">Tiempo Restante (CONTADOR):</span>
                                <p className="text-muted-foreground">
                                    {timeLeft} {/* TENGO QUE VER COMO HACER EL TEMA DEL RELOJ */}
                                </p>
                            </div>
                    </CardContent>
                </Card>
            </div>

            <hr />

            <h1 className="text-3xl font-bold tracking-tight">
            <TableOfContents className="inline-block mr-2" />
            Sección de Pujas
            </h1>

            {/* AQUI FALTA AGREGAR 2 BTN UNO QUE LIMPIE LA CAJA Y OTRO QUE ME DEJE HACER LA PUJA */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                        <Label>REALIZAR PUJA</Label>
                        <Controller
                        name="increment"
                        control={control}
                        render={({ field }) => (
                                <Input type="number" {...field} />
                        )}
                        />
                        {errors.increment && (
                        <p className="text-red-500">{errors.increment.message}</p>
                        )}
                </div>
            </form>

            {/* Sección de las pujas AQUI CARGAR TODAS LAS PUJAS AL OBJETO*/}
            <div className="flex-1 space-y-6">
                <Card>
                    <CardContent className="p-6 space-y-6">
                        {/* CAMPOS */}
                        <div className="flex items-center gap-4">
                            <ClipboardClock className="h-5 w-5 text-primary" />
                            <span className="font-semibold">Historial de pujas</span>
                        </div>
                        {/* Si no hay pujas, mostrar mensaje */}
                        {(auction.data.bids || []).length === 0 && (
                            <p className="text-muted-foreground">
                                No hay pujas realizadas aún.
                            </p>
                        )}
                        {(auction.data.bids || []).map((bid)=>(
                            <Card key={bid.id}>
                                <CardContent className="p-6 space-y-6">
                                    {/* Información de Usuario, monto y fecha en una sola fila */}
                                    <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                                        {/* Usuario */}
                                        <div className="flex items-center gap-4">
                                            <User className="h-5 w-5 text-primary" />
                                            <span className="font-semibold">Usuario:</span>
                                            <p className="text-muted-foreground">
                                                {bid.user.name}
                                            </p>
                                        </div>
                                        {/* Monto ofertado */}
                                        <div className="flex items-center gap-4">
                                            <CircleDollarSign className="h-5 w-5 text-primary" />
                                            <span className="font-semibold">Monto ofertado:</span>
                                            <p className="text-muted-foreground">
                                                {bid.amount}
                                            </p>
                                        </div>
                                        {/* Fecha y hora de la puja */}
                                        <div className="flex items-center gap-4">
                                            <ChartLine className="h-5 w-5 text-primary" />
                                            <span className="font-semibold">Fecha y hora de la puja:</span>
                                            <p className="text-muted-foreground">
                                                {bid.bid_time}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </Card>
    );
}
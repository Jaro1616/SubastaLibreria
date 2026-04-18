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
import { toast } from "sonner";
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
    BrushCleaning,
    ArrowLeft,
    ArrowUpRight
} from "lucide-react";
import { LoadingGrid } from '../../ui/custom/LoadingGrid';
import { EmptyState } from '../../ui/custom/EmptyState';
import AuctionService from "@/services/AuctionService";
import BidService from "@/services/BidService";
import PaymentService from "@/services/PaymentService";
// Pusher
import Pusher from 'pusher-js';

export function DoBids() {
    const navigate = useNavigate();
    const { id } = useParams();
    const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
    const [auction, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    //PARA EL CONTADOR
    const [timeLeft, setTimeLeft] = useState("");

    // PARA EL TEMA DE USUARIOS
    const usuariosPermitidos = [4, 8, 9, 10, 11, 12]; // IDS PERMITIDOS PARA HACER PUJAS (COMPRADORES)
    const [indiceUsuario, setIndiceUsuario] = useState(0);
    const currentUserId = usuariosPermitidos[indiceUsuario];


    /*** PARTE DE FORMULARIO ***/
    /*** Yup ***/
    const bidSchema = yup.object({
        auction_id: yup
        .number(),

        amount: yup
        .number()
        .typeError('Solo números')
        .required('Monto requerido')
        .moreThan(0, 'Debe ser mayor a 0')
    });

    /*** Form ***/
    const {
            control,
            handleSubmit,
            reset,
            formState: { errors },
    } = useForm({
            defaultValues: {
                auction_id: id,
                amount: ""
            },
            resolver: yupResolver(bidSchema)
    });

    //AQUI VA TODA LA LOGICA PARA HACER LA PUJA
    const onSubmit = async (data) => {
        try {
            const now = new Date();
            const end = new Date(auction.data.end_date);

            /* if (now >= end) {
                setError("La subasta ya ha finalizado");
                toast.error("La subasta ya ha finalizado");
                return;
            } */

            if (now >= end) {
                const mensaje = "La subasta ya ha finalizado";
                setError(mensaje);
                toast.error(mensaje);

                await CloseConfirmed(auction.data);

                return;
            }

            const currentHighest = auction.data.highest_bid?.amount || auction.data.base_price;
            const minAllowed = Number(currentHighest) + Number(auction.data.min_increment);

            // VALIDACIÓN PRINCIPAL
            if (Number(data.amount) < minAllowed) {
                const mensaje = `La puja mínima permitida es ₡${minAllowed.toLocaleString()}`;
                setError(mensaje);
                toast.error(mensaje);
                return;
            }

            const bidData = {
                auction_id: auction.data.id,
                customer_id: currentUserId,
                amount: Number(data.amount)
            };

            await BidService.createBid(bidData);

            toast.success("¡Puja realizada correctamente!");

            reset({ amount: "" });
            setError(null);

        } catch (err) {
            console.error(err);
            setError("Error al hacer la puja");
        }
    };
    /*** PARTE DE FORMULARIO ***/


    //FUNCION PARA CAMBIAR DE USUARIO (PARA PROBAR EL TEMA DE LAS PUJAS)
    const cambiarUsuario = () => {
    setIndiceUsuario((prevIndice) => 
        (prevIndice + 1) % usuariosPermitidos.length
    );
    };


    //FUNCION PARA PUSHER
    useEffect(() => {
        // Conexión
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
        });

        // Suscripción al canal de esta subasta
        const channel = pusher.subscribe(`auction-${id}`);

        // Escuchar el evento
        channel.bind('new-bid', (datosPusher) => {
            console.log("Datos recibidos de Pusher:", datosPusher);

            if (datosPusher.auction) {
                // --- LÓGICA DE NOTIFICACIÓN DE PUJA SUPERADA ---
                const nuevoLiderId = String(datosPusher.auction.highest_bid?.customer_id);
                const miIdSrt = String(currentUserId);

                if (nuevoLiderId === miIdSrt) {
                    toast.success("¡Vas a la cabeza!", {
                    description: "Tu puja es la más alta actualmente.",
                    });
                }
                else {
                    const yoEstabaParticipando = datosPusher.auction.bids?.some(
                        (bid) => String(bid.customer_id) === miIdSrt
                    );

                    if (yoEstabaParticipando) {
                        toast.error("⚠️ ¡Tu puja ha sido superada!", {
                            description: "Alguien ofreció un monto mayor. ¡Vuelve a pujar!",
                        });
                    } else {
                        toast.info("Nueva puja en la subasta", {
                            description: `El precio actual subió a ${datosPusher.auction.highest_bid.amount}`,
                        });
                    }
                }

                setData({
                    success: true,
                    status: 200,
                    data: datosPusher.auction
                });
            }
        });

        // Limpieza al salir de la página
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [id, currentUserId]);


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


    async function CloseConfirmed(auctionData) {
        const ganadorId = auctionData?.highest_bid?.customer_id;
        const ganadorNombre = auctionData?.user_leading?.name || "Sin postores";
        const montoFinal = auctionData?.highest_bid?.amount || auctionData.base_price;

        try {
            await AuctionService.closeAuction(auctionData.id);

            if (ganadorId) {
                const paymentData = {
                    auction_id: auctionData.id,
                    customer_id: ganadorId,
                    total: Number(montoFinal),
                    status: "Pending"
                };

                await PaymentService.createPayment(paymentData);
            }

            toast.success("¡Subasta finalizada!", {
                description: `Ganador: ${ganadorNombre} con ₡${Number(montoFinal).toLocaleString()}.`,
                duration: 5000,
            });

            setTimeout(() => {
                navigate("/auction/table");
            }, 3000);

        } catch (err) {
            console.error("Error en el cierre o pago:", err);
            toast.error("Ocurrió un error al procesar el cierre o el pago");
        }
    }

    if (loading) return <LoadingGrid count={1} type="grid" />;
    if (error) return <ErrorAlert title="Error al cargar subastas" message={error} />;
    if (!auction || !auction.data)
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

            <div className="flex justify-between gap-4 mt-6">
                <Button type="button" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4" />
                        Regresar
                </Button>
            </div>
            
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
                <div className="space-y-2">
                    <Label>REALIZAR PUJA</Label>
                    <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                            <Input type="number" {...field} />
                    )}
                    />
                    {errors.amount && (
                    <p className="text-red-500">{errors.amount.message}</p>
                    )}

                    {/* BOTONES */}
                    <Button type="submit" className="flex-1">
                            <ArrowUpRight className="w-4 h-4" />
                            Realizar puja
                    </Button>
                    <Button type="button" variant="destructive" 
                        onClick={() => reset({ amount: "" })}
                    >
                        <BrushCleaning className="w-4 h-4" />
                        Limpiar
                    </Button>
                    <br />
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={cambiarUsuario}
                        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                        >
                        Usuario ID: {currentUserId}
                    </Button>
                </div>
            </form>

            {/* Sección de las pujas*/}
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
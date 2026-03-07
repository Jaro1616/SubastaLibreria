import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorAlert } from "../../ui/custom/ErrorAlert";
// Shadcn UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    CircleDollarSign,
    ChartLine ,
    ArrowLeft,
    User
} from "lucide-react";
import { LoadingGrid } from '../../ui/custom/LoadingGrid';
import { EmptyState } from '../../ui/custom/EmptyState';
import BidService from "@/services/BidService";

export default function DetailBid() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [bid, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await BidService.getBidByAuction(id);
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
        fetchData(id)
    }, [id]);


    if (loading) return <LoadingGrid count={1} type="grid" />;
    if (error) return <ErrorAlert title="Error al cargar pujas" message={error} />;
    if (!bid || bid.data.length === 0)
        return <EmptyState message="No se encontraron pujas en esta subasta." />;
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Sección de los Detalles */}
                <div className="flex-1 space-y-6">
                    {/* Título */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            PUJAS REALIZADAS EN LA SUBASTA:
                        </h1>
                    </div>
                    {bid.data.map((bidItem)=>(
                        <Card key={bidItem.id}>
                            <CardContent className="p-6 space-y-6">
                                {/* Información de Usuario, monto y fecha en una sola fila */}
                                <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                                    {/* Usuario */}
                                    <div className="flex items-center gap-4">
                                        <User className="h-5 w-5 text-primary" />
                                        <span className="font-semibold">Usuario:</span>
                                        <p className="text-muted-foreground">
                                            {bidItem.user.name}
                                        </p>
                                    </div>
                                    {/* Monto ofertado */}
                                    <div className="flex items-center gap-4">
                                        <CircleDollarSign className="h-5 w-5 text-primary" />
                                        <span className="font-semibold">Monto ofertado:</span>
                                        <p className="text-muted-foreground">
                                            {bidItem.amount}
                                        </p>
                                    </div>
                                    {/* Fecha y hora de la puja */}
                                    <div className="flex items-center gap-4">
                                        <ChartLine className="h-5 w-5 text-primary" />
                                        <span className="font-semibold">Fecha y hora de la puja:</span>
                                        <p className="text-muted-foreground">
                                            {bidItem.bid_time}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
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
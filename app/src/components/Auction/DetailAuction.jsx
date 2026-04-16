import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorAlert } from "../ui/custom/ErrorAlert";
// Shadcn UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    TextInitial,
    ReceiptText,
    ScrollText,
    ChevronRight,
    ArrowLeft,
    List
} from "lucide-react";
import { LoadingGrid } from '../ui/custom/LoadingGrid';
import { EmptyState } from '../ui/custom/EmptyState';
import AuctionService from "@/services/AuctionService";

export default function DetailAuction() {
    const navigate = useNavigate();
    const { id } = useParams();
    const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
    const [auction, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Sección de la Imagen */}
                <div className="relative flex-shrink-0 w-full md:w-1/4 lg:w-1/5 rounded-lg overflow-hidden shadow-xl">
                    <div className="aspect-[2/3] w-full bg-muted flex items-center justify-center">
                        {auction.data.book?.imagen?.image_path ? ( 
                            <img
                                src={`${BASE_URL}/${auction.data.book.imagen.image_path}`}
                                alt={`Poster de ${auction.data.book.title}`}
                                className="w-full h-full object-contain"
                            />
                        ):(
                            <ScrollText className="h-1/2 w-1/2 text-muted-foreground" />
                        )}
                    </div>
                    {/* Badge del año en la esquina inferior derecha */}
                    <Badge variant="secondary" className="absolute bottom-4 right-4 text-1xl">
                        {auction.data.book.year}
                    </Badge>
                </div>

                {/* Sección de los Detalles */}
                <div className="flex-1 space-y-6">
                    {/* Título del libro */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            Detalle de la subasta: {auction.data.book.title}
                        </h1>
                    </div>

                    <Card>
                        <CardContent className="p-6 space-y-6">
                            {/* Información de edicion, descipcion e isbn en una sola fila */}
                            <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                                <h1>Categorias:</h1>
                                {/* Edicion */}
                                <div className="flex items-center gap-4">
                                    <ReceiptText className="h-5 w-5 text-primary" />
                                    <span className="font-semibold">Edición:</span>
                                    <p className="text-muted-foreground">
                                        {auction.data.book.edition.name}
                                    </p>
                                </div>
                                {/* Material */}
                                <div className="flex items-center gap-4">
                                    <TextInitial className="h-5 w-5 text-primary" />
                                    <span className="font-semibold">Descripción:</span>
                                    <p className="text-muted-foreground">
                                        {auction.data.book.material.name}
                                    </p>
                                </div>
                                {/* Géneros */}
                                <div className="grid gap-4 md:grid-cols-2">
                                {auction.data.book.genres && auction.data.book.genres.length > 0 && ( 
                                        <div>
                                            <div className="flex items-center gap-4 mb-2">
                                                <ScrollText className="h-5 w-5 text-primary" />
                                                <span className="font-semibold">Géneros:</span>
                                            </div>
                                            <div className="flex flex-col space-y-1">
                                                
                                                    {auction.data.book.genres.map((genre)=>(
                                                    <div key={genre.id}  className="flex items-center gap-2 py-1 px-2 text-sm">
                                                        <ChevronRight className="h-4 w-4 text-secondary" />
                                                        <span className="text-muted-foreground">
                                                            {genre.title}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )} 
                                </div>
                                
                                {/* Información de la subasta */}
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                    <List className="h-5 w-5 text-primary" />
                                    <span className="font-semibold">Registro de subastas:</span>
                                    </div>

                                    <div className="flex items-center gap-2 py-1 px-2 text-sm">
                                    <span className="text-muted-foreground">
                                        - Fecha de inicio: {auction.data.start_date}
                                        <br />- Fecha de cierre: {auction.data.end_date}
                                        <br />- Precio Base: {auction.data.base_price}
                                        <br />- Incremento Minimo: {auction.data.min_increment}
                                        <br />- Estado de la subasta: {auction.data.status}
                                        <br />- Pujas: {auction.data.pujas_realizadas}
                                    </span>
                                    </div>
                                </div>

                                <div>
                                    <Button
                                        type="button"
                                        onClick={() => navigate(`/auction/bid/detail/${auction.data.id}`)}
                                        className="px-4 py-2 bg-accent text-white hover:bg-accent/90"
                                    >
                                        Ver Pujas
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
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
}//final de todo
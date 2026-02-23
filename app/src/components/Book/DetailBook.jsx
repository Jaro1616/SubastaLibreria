import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorAlert } from "../ui/custom/ErrorAlert";
// Shadcn UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Clock,
    Globe,
    User,
    Film,
    Star,
    ChevronRight,
    ArrowLeft
} from "lucide-react";
import { LoadingGrid } from '../ui/custom/LoadingGrid';
import { EmptyState } from '../ui/custom/EmptyState';
import BookService from '../../services/BookService';

export function DetailBook() {
    const navigate = useNavigate();
    const { id } = useParams();
    const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
    const [book, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await BookService.getBookById(id);
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
    if (error) return <ErrorAlert title="Error al cargar libros" message={error} />;
    if (!book || book.data.length === 0)
        return <EmptyState message="No se encontraron libros en esta tienda." />;
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Sección de la Imagen */}
                <div className="relative flex-shrink-0 w-full md:w-1/4 lg:w-1/5 rounded-lg overflow-hidden shadow-xl">
                    <div className="aspect-[2/3] w-full bg-muted flex items-center justify-center">
                        {book.data.imagen?.image_path ? ( 
                            <img
                                src={`${BASE_URL}/${book.data.imagen.image_path}`}
                                alt={`Poster de ${book.data.title}`}
                                className="w-full h-full object-contain"
                            />
                        ):(
                            <Film className="h-1/2 w-1/2 text-muted-foreground" />
                        )}
                    </div>
                    {/* Badge del año en la esquina inferior derecha */}
                    <Badge variant="secondary" className="absolute bottom-4 right-4 text-1xl">
                        {book.data.year}
                    </Badge>
                </div>

                {/* Sección de los Detalles */}
                <div className="flex-1 space-y-6">
                    {/* Título del libro */}
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                            {book.data.title}
                        </h1>
                    </div>

                    <Card>
                        <CardContent className="p-6 space-y-6">
                            {/* Información de edicion, descipcion e isbn en una sola fila */}
                            <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                                {/* Edicion */}
                                <div className="flex items-center gap-4">
                                    <User className="h-5 w-5 text-primary" />
                                    <span className="font-semibold">Edición:</span>
                                    <p className="text-muted-foreground">
                                        {book.data.edition.name}
                                    </p>
                                </div>
                                {/* descripcion */}
                                <div className="flex items-center gap-4">
                                    <Clock className="h-5 w-5 text-primary" />
                                    <span className="font-semibold">Descripción:</span>
                                    <p className="text-muted-foreground">
                                        {book.data.description}
                                    </p>
                                </div>
                                {/* isbn */}
                                <div className="flex items-center gap-4">
                                    <Globe className="h-5 w-5 text-primary" />
                                    <span className="font-semibold">IsBn:</span>
                                    <p className="text-muted-foreground">
                                    {book.data.isbn}
                                    </p>
                                </div>
                            </div>

                            {/* Contenedor de dos columnas para géneros y materiales */}
                            <div className="grid gap-4 md:grid-cols-2">
                            {book.data.genres && book.data.genres.length > 0 && ( 
                                    <div>
                                        <div className="flex items-center gap-4 mb-2">
                                            <Film className="h-5 w-5 text-primary" />
                                            <span className="font-semibold">Géneros:</span>
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            
                                                {book.data.genres.map((genre)=>(
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

                                {/* {book.data.material && book.data.material.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-4 mb-2">
                                            <Star className="h-5 w-5 text-primary" />
                                            <span className="font-semibold">Actores Principales:</span>
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                         {book.data.material.map((material)=>(
                                                <div key={material.id}  className="flex items-center gap-2 py-1 px-2 text-sm">
                                                    <Star className="h-4 w-4 text-secondary" />
                                                    <span className="text-muted-foreground">
                                                        {`${material.name}`}
                                                    </span>
                                                </div>
                                         ))}
                                        </div>
                                    </div>
                                )} */}
                                {book?.data?.material && (
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                    <Star className="h-5 w-5 text-primary" />
                                    <span className="font-semibold">Material:</span>
                                    </div>

                                    <div className="flex items-center gap-2 py-1 px-2 text-sm">
                                    <Star className="h-4 w-4 text-secondary" />
                                    <span className="text-muted-foreground">
                                        {book.data.material.name}
                                    </span>
                                    </div>
                                </div>
                                )}

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
}
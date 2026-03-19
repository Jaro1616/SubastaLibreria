import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BookService from "../../services/BookService";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { EmptyState } from "../ui/custom/EmptyState";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ListCardBooks } from "./ListCardBook";

export function ListBooks() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await BookService.getBooks();
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
        fetchData()
    }, []);


    if (loading) return <LoadingGrid type="grid" />;
    if (error) return <ErrorAlert title="Error al cargar libros" message={error} />;
    if (!data || data.data.length === 0)
        return <EmptyState message="No se encontraron libros para el usuario." />;

    return (
        <div className="mx-auto max-w-7xl p-6">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
                Listado de Libros
            </h1>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild variant="outline" size="icon" className="text-primary">
                            <Link to="/book/create">
                                <Plus className="h-4 w-4" />
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Crear Libro</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        {data && (
            <ListCardBooks data={data.data} />
        )}
        </div>
    );
}

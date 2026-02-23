import { useEffect, useState } from "react";
import BookService from "../../services/BookService";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { EmptyState } from "../ui/custom/EmptyState";
import { ErrorAlert } from "../ui/custom/ErrorAlert";

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
        {data && (
            <ListCardBooks data={data.data} />
        )}
        </div>
    );
}

import { Link, useNavigate } from "react-router-dom";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, ArrowLeft, CircleDollarSign, FilmIcon } from "lucide-react";
import AuctionService from "@/services/AuctionService";
import { useEffect, useState } from "react";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { EmptyState } from "../ui/custom/EmptyState";
import { toast } from "sonner";

// Headers de la tabla
//map = foreach
const auctionColumns = [
    { key: "image", label: "Imagen" },
    { key: "name", label: "Nombre" },
    { key: "dateStart", label: "Fecha Inicio" },
    { key: "dateEnd", label: "Fecha Fin" },
    { key: "minIncrement", label: "Incremento minimo" },
    { key: "bids", label: "Pujas" },
    { key: "status", label: "Estado" },
    { key: "actions", label: "Acciones" },
];

export default function TableAuctions() {
    const navigate = useNavigate();
    const [auctions, setAuctions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { 
        const fetchData = async () => {
        try {
            const response = await AuctionService.getAuctions();
            console.log(response)
            const result = response.data;
            console.log(result)
            if (result.success) {
                setAuctions(result.data || []);
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

    if (loading) return <LoadingGrid type="grid" />; 
    if (error) return <ErrorAlert title="Error al cargar subastas" message={error} />; 
    if (auctions.length === 0) 
    return <EmptyState message="No se encontraron subastas." />; 

    const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";

    // Función para manejar la eliminación de un libro con confirmación
    function handleDelete(id) {
        toast.warning("¿Seguro que deseas eliminar el libro?", {
        action: {
            label: "Eliminar",
            onClick: () => deleteConfirmed(id),
        },
        });
    }

    function deleteConfirmed(id) {
        AuctionService.deleteAuction(id)
        .then(() => {
            toast.success("Subasta eliminada correctamente");
            setTimeout(() => window.location.reload(), 800);
        })
        .catch((err) => {
            console.error(err);
            toast.error("Ocurrió un error al eliminar");
        });
    }
    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">
                    <CircleDollarSign className="inline-block mr-2" />
                    Listado de Subastas
                </h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button asChild variant="outline" size="icon" className="text-primary">
                                <Link to="/auction/create">
                                    <Plus className="h-4 w-4" />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Crear subasta</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-primary/50">
                        <TableRow>
                            {/* ()=>{} */}
                            {/* ()=>() */}
                            {auctionColumns.map((col)=>( 
                                <TableHead key={col.key}  className="text-left font-semibold">
                                    {col.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {auctions.map((auction)=>( 
                            <TableRow key={auction.id} /*className="h-16" - ESTO ME SIRVE PARA HACER MÁS ANCHA LA CELDA*/>
                                <TableCell className="relative w-52 h-76">
                                {auction.book.imagen?.image_path ? (
                                    <img
                                        src={`${BASE_URL}/${auction.book.imagen.image_path}`}
                                        alt={auction.book.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
                                        <FilmIcon className="h-1/2 w-1/2" />
                                    </div>
                                )} </TableCell>
                                <TableCell className="text-lg">{auction.book.title}</TableCell>
                                <TableCell className="text-lg">{auction.start_date}</TableCell>
                                <TableCell className="text-lg">{auction.end_date}</TableCell>
                                <TableCell className="text-lg">{auction.min_increment}</TableCell>
                                <TableCell className="text-lg">{auction.pujas_realizadas}</TableCell>
                                <TableCell className="text-lg">{auction.status}</TableCell>
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
                                        disabled={!(auction.status !== "Active" && auction.pujas_realizadas == 0) || auction.status == "Cancelled"}
                                        type="button"
                                        onClick={() => navigate(`/auction/update/${auction.id}`)}
                                        className="w-20 h-20 flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-25"
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        disabled={!(auction.status !== "Active" && auction.pujas_realizadas == 0) || auction.status == "Cancelled"}
                                        variant="destructive" 
                                        type="button"
                                        onClick={() => handleDelete(auction.id)} //AQUÍ SE LLAMA A LA FUNCIÓN DE ELIMINAR CON CONFIRMACIÓN
                                        className="w-20 h-20 flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-25"
                                    >
                                        Cancelar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>
            <Button
                type="button"
                onClick={() => navigate("/")}
                className="flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-6"
            >
                <ArrowLeft x className="w-4 h-4" />
                Regresar
            </Button>
        </div>
    );
}
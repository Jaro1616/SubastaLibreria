import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Plus, ArrowLeft, CircleDollarSign } from "lucide-react";

import AuctionService from "@/services/AuctionService";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { EmptyState } from "../ui/custom/EmptyState";

import TableActiveAuctions from "./TableActiveAuctions";
import TableClosedAuctions from "./TableClosedAuctions";

export default function TableAuctions() {
    const navigate = useNavigate();

    const [auctions, setAuctions] = useState([]);
    const [filterStatus, setFilterStatus] = useState("active");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await AuctionService.getAuctions();
            const result = response.data;

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
    fetchData();
    }, []);

    // estados de UI
    if (loading) return <LoadingGrid type="grid" />;
    if (error) return <ErrorAlert title="Error al cargar subastas" message={error} />;
    if (auctions.length === 0)
        return <EmptyState message="No se encontraron subastas." />;

    // separar subastas por estado
    const activeAuctions = auctions.filter(a => a.status === "Active");
    const closedAuctions = auctions.filter(a => a.status === "Closed");

    return (
        <div className="container mx-auto py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
            <CircleDollarSign className="inline-block mr-2" />
            Listado de Subastas
            </h1>

            <div className="flex items-center gap-4">
            {/* Combo filtro */}
            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border rounded px-3 py-2"
            >
                <option value="active">Subastas activas</option>
                <option value="closed">Subastas finalizadas</option>
            </select>

            {/* Boton crear */}
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
        </div>

        {/* Tabla */}
        <div className="rounded-md border">
            {filterStatus === "active" ? (
            <TableActiveAuctions auctions={activeAuctions} />
            ) : (
            <TableClosedAuctions auctions={closedAuctions} />
            )}
        </div>

        {/* Boton regresar */}
        <Button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-6"
        >
            <ArrowLeft className="w-4 h-4" />
            Regresar
        </Button>
        </div>
    );
}
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { format } from "date-fns";

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

// icons
import { Save, ArrowLeft } from "lucide-react";

// services
import AuctionService from "../../services/AuctionService";

export function UpdateAuction() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [auction, setAuction] = useState(null);
    const [error, setError] = useState("");

    const BASE_URL_image = import.meta.env.VITE_BASE_URL + "uploads";

    /*** Yup ***/
    const auctionSchema = yup.object({
        start_date: yup.date().required(),
        end_date: yup
            .date()
            .required()
            .min(yup.ref("start_date"), "Debe ser mayor a inicio"),
        base_price: yup.number().required().moreThan(0),
        min_increment: yup.number().required().moreThan(0),
    });

    /*** Form ***/
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            start_date: "",
            end_date: "",
            base_price: "",
            min_increment: "",
        },
        resolver: yupResolver(auctionSchema),
    });

    /*** Cargar libros ***/
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await AuctionService.getAuctionById(id);
                const data = res.data.data;

                console.log("Auction:", data);

                setAuction(data);

                reset({
                    start_date: format(new Date(data.start_date), "yyyy-MM-dd'T'HH:mm"),
                    end_date: format(new Date(data.end_date), "yyyy-MM-dd'T'HH:mm"),
                    base_price: data.base_price,
                    min_increment: data.min_increment,
                });

            } catch (err) {
                console.error(err);
                setError("Error cargando subasta");
            }
        };

        fetchData();
    }, [id, reset, navigate]);

    /*** Submit */
    const onSubmit = async (dataForm) => {
        try {
            const payload = {
                id,
                start_date: format(new Date(dataForm.start_date), "yyyy-MM-dd HH:mm:ss"),
                end_date: format(new Date(dataForm.end_date), "yyyy-MM-dd HH:mm:ss"),
                base_price: dataForm.base_price,
                min_increment: dataForm.min_increment,
            };

            await AuctionService.updateAuction(payload);

            toast.success("Subasta actualizada");
            navigate("/auction/maintenance");

        } catch (err) {
            console.error(err);
            setError("Error al actualizar");
        }
    };

    if (error) return <p className="text-red-600">{error}</p>;

    if (!auction) return <p>Cargando...</p>;

    return (
        <Card className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Editar Subasta</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* LIBRO (NO EDITABLE) */}
                <div>
                    <Label>Libro</Label>
                    <Input value={auction.book.title} readOnly />
                </div>

                {/* PREVIEW */}
                <Card className="p-4">
                    <p><strong>Autor:</strong> {auction.book.author}</p>
                    <p><strong>ISBN:</strong> {auction.book.isbn}</p>

                    {auction.book.imagen && (
                        <img
                            src={BASE_URL_image + "/" + auction.book.imagen.image_path}
                            className="w-40 mt-2"
                        />
                    )}
                </Card>

                {/* VENDEDOR */}
                <div>
                    <Label>Vendedor</Label>
                    <Input
                        value={auction.book.seller.name}
                        readOnly
                        className="text-green-600 font-semibold"
                    />
                </div>

                {/* EDITABLES */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>
                        <Label>Fecha inicio</Label>
                        <Controller
                            name="start_date"
                            control={control}
                            render={({ field }) => (
                                <Input type="datetime-local" {...field} />
                            )}
                        />
                        {errors.start_date && <p className="text-red-500">{errors.start_date.message}</p>}
                    </div>

                    <div>
                        <Label>Fecha cierre</Label>
                        <Controller
                            name="end_date"
                            control={control}
                            render={({ field }) => (
                                <Input type="datetime-local" {...field} />
                            )}
                        />
                        {errors.end_date && <p className="text-red-500">{errors.end_date.message}</p>}
                    </div>

                    <div>
                        <Label>Precio base</Label>
                        <Controller
                            name="base_price"
                            control={control}
                            render={({ field }) => (
                                <Input type="number" {...field} />
                            )}
                        />
                    </div>

                    <div>
                        <Label>Incremento mínimo</Label>
                        <Controller
                            name="min_increment"
                            control={control}
                            render={({ field }) => (
                                <Input type="number" {...field} />
                            )}
                        />
                    </div>
                </div>

                {/* BOTONES */}
                <div className="flex justify-between gap-4 mt-6">
                    <Button type="button" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4" />
                        Regresar
                    </Button>

                    <Button type="submit" className="flex-1">
                        <Save className="w-4 h-4" />
                        Guardar
                    </Button>
                </div>

            </form>
        </Card>
    );
}
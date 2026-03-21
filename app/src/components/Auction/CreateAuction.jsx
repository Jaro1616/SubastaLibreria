import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { format } from "date-fns";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

// icons
import { Save, ArrowLeft } from "lucide-react";

// servicios
import BookService from "../../services/BookService";
import AuctionService from "../../services/AuctionService";

import { CustomSelect } from "../ui/custom/custom-select";

export function CreateAuction() {
        const navigate = useNavigate();

        const currentUser = {
                id: 1,
                name: "Juan Perez"
        };

        const [books, setBooks] = useState([]);
        const [selectedBook, setSelectedBook] = useState(null);
        const [error, setError] = useState("");

        const BASE_URL_image = import.meta.env.VITE_BASE_URL + "uploads";

        /*** Yup ***/
        const auctionSchema = yup.object({
                book_id: yup
                .number()
                .typeError('Seleccione un libro')
                .required('El objeto es requerido'),

                start_date: yup
                .date()
                .typeError('Fecha inválida')
                .required('La fecha de inicio es requerida'),

                end_date: yup
                .date()
                .typeError('Fecha inválida')
                .required('La fecha de cierre es requerida')
                .min(yup.ref('start_date'), 'Debe ser mayor a la fecha de inicio'),

                base_price: yup
                .number()
                .typeError('Solo números')
                .required('Precio base requerido')
                .moreThan(0, 'Debe ser mayor a 0'),

                min_increment: yup
                .number()
                .typeError('Solo números')
                .required('Incremento requerido')
                .moreThan(0, 'Debe ser mayor a 0')
        });

        /*** Form ***/
        const {
                control,
                handleSubmit,
                watch,
                formState: { errors },
        } = useForm({
                defaultValues: {
                book_id: "",
                start_date: "",
                end_date: "",
                base_price: "",
                min_increment: 1
                },
                resolver: yupResolver(auctionSchema)
        });

        /*** Cargar libros ***/
        useEffect(() => {
                const fetchData = async () => {
                try {
                        const res = await BookService.getBooks();

                        console.log("Books:", res.data); // DEBUG

                        setBooks(res.data.data || []);
                } catch (err) {
                        console.error(err);
                        setError("Error cargando libros");
                }
                };

                fetchData();
        }, []);

        const availableBooks = books.filter(
                b => b.seller_id == currentUser.id && b.isEditable == 1 && b.active == 1
        );

        /*** Selección de libro */
        const bookId = watch("book_id");

        useEffect(() => {
                if (bookId && books.length > 0) {
                const book = books.find(b => b.id == bookId);
                setSelectedBook(book);
                }
        }, [bookId, books]);

        /*** Submit */
        const onSubmit = async (data) => {
                try {
                const formattedData = {
                ...data,
                start_date: format(new Date(data.start_date), "yyyy-MM-dd HH:mm:ss"),
                end_date: format(new Date(data.end_date), "yyyy-MM-dd HH:mm:ss"),
                status: "Active"
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

        if (error) return <p className="text-red-600">{error}</p>;

        return (
                <Card className="p-6 max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Crear Subasta</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* LIBRO */}
                        <div>
                        <Label className="block mb-1 text-sm font-medium">
                                Objeto (Libro)
                        </Label>

                        <Controller
                                name="book_id"
                                control={control}
                                render={({ field }) => (
                                <CustomSelect
                                        field={field}
                                        data={availableBooks}
                                        label="Libro"
                                        getOptionLabel={(b) => b.title}
                                        getOptionValue={(b) => b.id}
                                        error={errors.book_id?.message}
                                />
                                )}
                        />
                        </div>

                        {/* PREVIEW */}
                        {selectedBook && (
                        <Card className="p-4">
                                <p><strong>Título:</strong> {selectedBook.title}</p>
                                <p><strong>Autor:</strong> {selectedBook.author}</p>
                                <p><strong>ISBN:</strong> {selectedBook.isbn}</p>

                                {selectedBook.imagen && (
                                <img
                                        src={BASE_URL_image + "/" + selectedBook.imagen.image_path}
                                        className="w-40 mt-2 rounded"
                                />
                                )}
                        </Card>
                        )}

                        {/* USUARIO */}
                        <div>
                        <Label className="block mb-1 text-sm font-medium">
                                Vendedor
                        </Label>
                        <Input
                                value={currentUser.name}
                                readOnly
                                className="mt-2 text-green-600 font-semibold"
                        />
                        </div>

                        {/* FORMULARIO SUBASTA */}
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
                                {errors.start_date && (
                                <p className="text-red-500">{errors.start_date.message}</p>
                                )}
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
                                {errors.end_date && (
                                <p className="text-red-500">{errors.end_date.message}</p>
                                )}
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
                                {errors.base_price && (
                                <p className="text-red-500">{errors.base_price.message}</p>
                                )}
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
                                {errors.min_increment && (
                                <p className="text-red-500">{errors.min_increment.message}</p>
                                )}
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
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

// icons
import { Save, ArrowLeft } from "lucide-react";

// servicios
import MaterialService from "../../services/MaterialService";
import EditionService from "../../services/EditionService";
import GenreService from "../../services/GenreService";
import UserService from "../../services/UserService";
import BookService from "../../services/BookService";   
import ImageService from "../../services/ImageService";

import { CustomInputField } from "../ui/custom/custom-input-field";
import { CustomSelect } from "../ui/custom/custom-select";
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select"; // select multi con chips

export function UpdateBook() {
    const navigate = useNavigate();
    const { id } = useParams(); // id del libro a actualizar
    const BASE_URL_image = import.meta.env.VITE_BASE_URL + "uploads";

    /*** Estados para selects y preview de imagen ***/
    const [dataMaterial, setDataMaterial] = useState([]); 
    const [dataEdition, setDataEdition] = useState([]); 
    const [dataGenres, setDataGenres] = useState([]); 
    const [dataUser, setDataUser] = useState([]);
    const currentUser = { //ID PARA HACER LA PRUEBA, DESPUES LO TENGO QUE QUITAR CUANDO HAGA AUTENTICACION
        id: 1,
        name: "Juan Perez"
    };

    const [file, setFile] = useState(null);
    const [fileURL, setFileURL] = useState(null);
    const [error, setError] = useState("");

    /*** Esquema de validación Yup ***/
    const bookSchema= yup.object({
        title: yup.string()
                .required('El titulo es requerido')
                .min(2,'El titulo debe tener al menos 2 caracteres'),
        author: yup.string()
                .required('El autor es requerido')
                .min(2,'El autor debe tener al menos 2 caracteres'),
        isbn: yup.string()
                .required('El isbn es requerido')
                .min(2,'El isbn debe tener al menos 2 caracteres'),
        publisher: yup.string()
                .required('La editorial es requerida')
                .min(2,'La editorial debe tener al menos 2 caracteres'),
        year: yup 
                .number() 
                .typeError('Solo acepta números') 
                .required('El año es requerido') 
                .positive('Solo acepta números positivos'), 
        seller_id: yup 
                .number() 
                .typeError('Seleccione un vendedor') 
                .required('El vendedor es requerido'),
        material_id: yup 
                .number() 
                .typeError('Seleccione un material') 
                .required('El material es requerido'),
        edition_id: yup 
                .number() 
                .typeError('Seleccione una edición') 
                .required('La edición es requerida'),
        description: yup.string()
                .required('La descripción es requerida')
                .min(20,'La descripción debe tener al menos 20 caracteres'),
        genres: yup.array().min(1, 'El género es requerido'), 
    })

    /*** React Hook Form ***/
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            id: "",
            title: "",
            author: "",
            isbn: "",
            publisher: "",
            year: "",
            seller_id: currentUser.id, // Asignar el ID del usuario actual - ESTO DESPUES LO TENGO QUE QUITAR CUANDO HAGA AUTENTICACION
            material_id: "",
            edition_id: "",
            description: "",
            genres: [],
        },
        resolver:yupResolver(bookSchema)
    });

    /*** Manejo de imagen ***/
    const handleChangeImage = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
        setFile(selectedFile);
        setFileURL(URL.createObjectURL(selectedFile));
        }
    };

    useEffect(() => {
        const fetchData=async()=>{
            try {
                // Materiales
                const materialsRes = await MaterialService.getMaterials();
                // Ediciones
                const editionsRes = await EditionService.getEditions();
                // Géneros
                const genresRes = await GenreService.getGenres();
                // Usuarios (vendedores)
                const usersRes = await UserService.getUsers();
                //Libro a actualizar
                const bookRes = await BookService.getBookById(id);
    
                // Guardar datos
                setDataMaterial(materialsRes.data.data || []);
                setDataEdition(editionsRes.data.data || []);
                setDataGenres(genresRes.data.data || []);
                setDataUser(usersRes.data.data || []);

                if (bookRes.data) {
                const book = bookRes.data.data
                console.log(book)
                reset({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    isbn: book.isbn,
                    publisher: book.publisher,
                    year: book.year,
                    seller_id: book.seller_id,
                    material_id: book.material_id,
                    edition_id: book.edition_id,
                    description: book.description,
                    genres: book.genres.map(g => g.id)
                })
                if (book.imagen) setFileURL(BASE_URL_image + "/" + book.imagen.image_path)
                }

            } catch (error) {
                console.log(error)
                if(error.name != "AbortError") setError(error.message)
            }
        }; 
        fetchData();
    }, [BASE_URL_image, id, reset]);
    
    /*** Submit ***/
    const onSubmit = async (dataForm) => {
        try {
        // isValid es async y recibe los datos
        const isValid = await bookSchema.isValid(dataForm);
        if (!isValid) return;

        const response = await BookService.updateBook(dataForm);
        //Imagen y notificación
        //FormData para guardar imagen
        if (file) {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("book_id", response.data.data.id)
            //Guardar imagen en el API
            await ImageService.createImage(formData)
        }

        //Notificación crear
        toast.success(
            `Libro actualizado ${response.data.data.id} - ${response.data.data.title}`,
            { duration: 3000 }
        )
        //Redireccionar al listado
        navigate("/book")

        } catch (err) {
        console.error(err);
        setError("Error al actualizar libro");
        }
    };

    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <Card className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Actualizar Libro</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Título */}
                <div>
                    <Label className="block mb-1 text-sm font-medium" htmlFor="title">Título</Label>
                    {/* Controller entrada título */}
                    <Controller name="title" control={control} render={({field})=>
                        <Input {...field} id="title" placeholder="Ingrese el titulo" />
                    } />
                    {/* Error entrada título */}
                    {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>} 
                </div>

                {/* */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        {/* Controller entrada author */}
                        <Controller name="author" control={control} render={({field})=>
                        <CustomInputField 
                            {...field} 
                            label="Autor" 
                            placeholder="Nombre del autor"
                            error={errors.author?.message}
                        />
                        } />
                    </div>
                    <div>
                        {/* Controller entrada isbn */}
                        <Controller name="isbn" control={control} render={({field})=>
                        <CustomInputField 
                            {...field} 
                            label="ISBN" 
                            placeholder="123-456-789"
                            error={errors.isbn?.message}
                        />
                        } />
                    </div>
                    <div>
                        {/* Controller entrada publisher */}
                        <Controller name="publisher" control={control} render={({field})=>
                        <CustomInputField 
                            {...field} 
                            label="Editorial" 
                            placeholder="Escribe la editorial"
                            error={errors.publisher?.message}
                        />
                        } />
                    </div>
                    <div>
                        {/* Controller entrada year */}
                        <Controller name="year" control={control} render={({field})=>
                        <CustomInputField 
                            {...field} 
                            label="Año" 
                            placeholder="2025"
                            error={errors.year?.message}
                        />
                        } />
                    </div>
                    <div>
                        {/* Controller entrada descripción */}
                        <Controller name="description" control={control} render={({field})=>
                        <CustomInputField 
                            {...field} 
                            label="Descripción" 
                            placeholder="Describe el libro"
                            error={errors.description?.message}
                        />
                        } />
                    </div>
                    <div>
                        <Label>Estado</Label>
                        <Input value="Activo" readOnly className="mt-2 text-green-600 font-semibold" />
                    </div>
                </div>

                {/* Dueño */}
                <div>
                    <Label className="block mb-1 text-sm font-medium">Dueño</Label>
                    {/* Controller entrada dueño */}
                    <Controller name="seller_id" control={control} render={({field})=> 
                        <CustomSelect
                        field={field}
                        data={[currentUser]} // DESPUES REEMPLAZAR POR dataUser 
                        label="Dueño"
                        getOptionLabel={(user)=>`${user.name}`}
                        getOptionValue={(user)=> user.id} 
                        error={errors.seller_id?.message}
                        />
                    } />
                </div>
                {/* Material */}
                <div>
                    <Label className="block mb-1 text-sm font-medium">Material</Label>
                    {/* Controller entrada material */}
                    <Controller name="material_id" control={control} render={({field})=> 
                        <CustomSelect
                        field={field}
                        data={dataMaterial}
                        label="Material"
                        getOptionLabel={(material)=>`${material.name}`}
                        getOptionValue={(material)=> material.id} 
                        error={errors.material_id?.message}
                        />
                    } />
                </div>
                {/* Edición */}
                <div>
                    <Label className="block mb-1 text-sm font-medium">Edición</Label>
                    {/* Controller entrada material */}
                    <Controller name="edition_id" control={control} render={({field})=> 
                        <CustomSelect
                        field={field}
                        data={dataEdition}
                        label="Edición"
                        getOptionLabel={(edition)=>`${edition.name}`}
                        getOptionValue={(edition)=> edition.id} 
                        error={errors.edition_id?.message}
                        />
                    } />
                </div>

                {/* Géneros */}
                <div>
                    {/* Controller entrada generos */}
                    <Controller name="genres" control={control} render={({field})=> 
                        <CustomMultiSelect
                        field={field}
                        data={dataGenres}
                        label="Géneros"
                        getOptionLabel={(item)=>item.title}
                        getOptionValue={(item)=> item.id} 
                        error={errors.genres?.message}
                        placeholder="Seleccione géneros"
                        />
                    } />
                </div>

                {/* Imagen */}
                <div className="mb-6">
                <Label htmlFor="image" className="block mb-1 text-sm font-medium">
                    Imagen
                </Label>

                <div
                    className="relative w-56 h-56 border-2 border-dashed border-muted/50 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors"
                    onClick={() => document.getElementById("image").click()}
                >
                    {!fileURL && (
                    <div className="text-center px-4">
                        <p className="text-sm text-muted-foreground">Haz clic o arrastra una imagen</p>
                        <p className="text-xs text-muted-foreground">(jpg, png, máximo 5MB)</p>
                    </div>
                    )}
                    {fileURL && (
                    <img
                        src={fileURL}
                        alt="preview"
                        className="w-full h-full object-contain rounded-lg shadow-sm"
                    />
                    )}
                </div>

                <input
                    type="file"
                    id="image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleChangeImage}
                />
                </div>

                <div className="flex justify-between gap-4 mt-6">
                <Button
                    type="button"
                    variant="default" // sólido
                    className="flex items-center gap-2 bg-accent text-white"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Regresar
                </Button>
                {/* Botón Guardar */}
                <Button type="submit" className="flex-1">
                    <Save className="w-4 h-4" />
                    Guardar
                </Button>
                </div>
            </form>
        </Card>
    );
}
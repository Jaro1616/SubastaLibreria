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

// servicio
import UserService from "../../services/UserService";

// componentes reutilizables
import { CustomInputField } from "../ui/custom/custom-input-field";

export function UpdateUser() {
    const navigate = useNavigate();
    const { id } = useParams(); // id del usuario a actualizar

    const [error, setError] = useState("");

    /*** Esquema de validación Yup ***/
    const userSchema = yup.object({
        name: yup.string().required("El nombre es requerido").min(2, "El nombre debe tener al menos 2 caracteres"),
        email: yup.string().required("El email es requerido").email("Ingrese un email válido"),
    });

    /*** React Hook Form ***/
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
        id: "",
        name: "",
        email: "",
        active: "1",
        },
        resolver: yupResolver(userSchema),
    });

    useEffect(() => {
        const fetchUser = async () => {
        try {
        const response = await UserService.getUserById(id);
        const user = response.data.data;

        reset({
            id: user.id,
            name: user.name,
            email: user.email,
            active: user.active.toString()
        });

        } catch (err) {
            if (err.name !== "AbortError") setError(err.message);
        }
    };

    fetchUser();
    } , [id, reset]);

    const onSubmit = async (dataForm) => {
        try {
        // isValid es async y recibe los datos
        const isValid = await userSchema.isValid(dataForm);
        if (!isValid) return;

        const response = await UserService.updateUser(dataForm);

        //Notificación crear
        toast.success(
            `Usuario actualizado ${response.data.data.name}`,
            { duration: 3000 }
        )
        //Redireccionar al listado
        navigate("/user/table")

        } catch (err) {
            console.error(err);
            setError("Error al actualizar usuario");
        }
    }

    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <Card className="p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Actualizar Usuario</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Nombre */}
                <div>
                    <Label className="block mb-1 text-sm font-medium" htmlFor="name">Nombre</Label>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => <Input {...field} id="name" placeholder="Ingrese el nombre" />}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                {/* email*/}
                <div>
                    <Controller
                    name="email"
                    control={control}
                    render={({ field }) =>
                        <CustomInputField
                        {...field}
                        label="Email"
                        placeholder="ejemplo@gmail.com"
                        error={errors.email?.message}
                        />
                    }
                    />
                </div>
                {/*Estado*/}
                <div>
                    <Label>Estado</Label>
                    <Controller
                        name="active"
                        control={control}
                        render={({ field }) => (
                        <Button
                            type="button"
                            onClick={() => field.onChange(field.value === "1" ? "0" : "1")}
                            className={`w-full mt-2 ${
                            field.value === "1"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                            } text-white`}
                        >
                            {field.value === "1" ? "Activo" : "Inactivo"}
                        </Button>
                        )}
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
}// EL FINALLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL
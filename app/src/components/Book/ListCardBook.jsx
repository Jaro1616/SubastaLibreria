import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { ScanBarcode, TextInitial, Info, FilmIcon, User, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import BookService from "../../services/BookService";   
import { toast } from "sonner";

ListCardBooks.propTypes = {
  data: PropTypes.array,
};

export function ListCardBooks({ data }) {
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
    BookService.deleteBook(id)
      .then(() => {
        toast.success("Libro eliminado correctamente");
        setTimeout(() => window.location.reload(), 800);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Ocurrió un error al eliminar");
      });
  }

  return (
    <div className="grid gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {data && data.map((item) => (
        <Card key={item.id} className="flex flex-col overflow-hidden">
          {/* Header */}
          <CardHeader className="text-primary text-center">
            <CardTitle className="text-lg font-semibold">
              {item.title}
            </CardTitle>
            <p className="text-sm opacity-80">{item.author}</p>
          </CardHeader>

          {/* Imagen */}
          <div className="relative w-full aspect-video">
            {item.imagen?.image_path ? (
              <img
                src={`${BASE_URL}/${item.imagen.image_path}`}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
                <FilmIcon className="h-1/2 w-1/2" />
              </div>
            )}
          </div>

          {/* Contenido */}
          <CardContent className="flex-1 space-y-2 pt-4">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-6 w-6 text-primary" />
              Dueño: {item.seller.name}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <ScanBarcode className="h-6 w-6 text-primary" />
              {item.isbn}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <TextInitial className="h-6 w-6 text-primary" />
              {item.description}
            </p>
          </CardContent>

          {/* Acciones */}
          <div className="flex justify-end gap-2 border-t p-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon" className="size-8"
                  >
                    <Link to={`/book/detail/${item.id}`}>
                      <Info />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Ver detalle</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button disabled={!item.isEditable}
                    size="icon" className="size-8"
                  >
                    <Link to={`/book/edit/${item.id}`}>
                      < Edit />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Editar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    disabled={!item.isDeletable}
                    variant="destructive" 
                    size="icon" 
                    className="size-8"
                    onClick={() => handleDelete(item.id)}
                  >
                    < Trash2 />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Eliminar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </Card>
      ))}
    </div>
  );
}



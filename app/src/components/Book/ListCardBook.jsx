import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Clock, Globe, Info, FilmIcon } from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

ListCardBooks.propTypes = {
  data: PropTypes.array,
};

export function ListCardBooks({ data }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";

  return (
    <div className="grid gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {data && data.map((item) => (
        <Card key={item.id} className="flex flex-col overflow-hidden">
          {/* Header */}
          <CardHeader className="text-secondary text-center">
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
            {/* {isShopping && item.price && (
              <Badge
                variant="secondary"
                className="absolute top-2 right-2 text-base font-bold bg-primary text-primary-foreground"
              >
                ₡{parseFloat(item.price).toFixed(2)} colones
              </Badge>
            )} */}
          </div>

          {/* Contenido */}
          <CardContent className="flex-1 space-y-2 pt-4">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Cod: {item.isbn}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4 text-secondary" />
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

            {/* {isShopping && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" className="size-8"
                    >
                      <ShoppingCart />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Agregar al carrito</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )} */}
          </div>
        </Card>
      ))}
    </div>
  );
}



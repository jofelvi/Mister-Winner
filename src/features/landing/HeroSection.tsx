import Button from "@/components/ui/Button";
import {Ticket} from "lucide-react";

export const HeroSection = () => {
    return (
        <section className="w-full py-20 md:py-32 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-gray-900 mb-4">
                    La forma más fácil de participar y ganar.
                </h1>
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-8">
                    Compra tus números de la suerte, sigue los sorteos en vivo y reclama tus premios. ¡Nunca fue tan sencillo!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="px-8 py-3 text-lg">
                        <Ticket className="mr-2 h-5 w-5" /> Ver Rifas Disponibles
                    </Button>
                    <Button variant="secondary" className="px-8 py-3 text-lg">
                        Aprende Más
                    </Button>
                </div>
            </div>
        </section>
    );
};
import {Award, Hash, Ticket} from "lucide-react";

export const HowItWorks = () => {
    const steps = [
        { icon: <Hash className="h-10 w-10 text-blue-600" />, title: "Elige tu número", description: "Explora las rifas disponibles y selecciona tus números de la suerte." },
        { icon: <Ticket className="h-10 w-10 text-blue-600" />, title: "Compra tu ticket", description: "Realiza el pago de forma segura a través de Pago Móvil o con tus créditos." },
        { icon: <Award className="h-10 w-10 text-blue-600" />, title: "¡Verifica y Gana!", description: "Sigue el sorteo y comprueba si eres el afortunado ganador. ¡Cobra tu premio al instante!" },
    ];

    return (
        <section id="como-funciona" className="w-full py-20 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tight text-center mb-12">¿Cómo Funciona?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center">
                            <div className="flex justify-center items-center mb-4 bg-blue-100 rounded-full w-20 h-20 mx-auto">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
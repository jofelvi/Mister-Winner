import { Ticket, } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="container mx-auto py-8 px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Ticket className="h-6 w-6 text-blue-600" />
                        <span className="font-bold text-lg">RifaWeb</span>
                    </div>
                    <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} RifaWeb. Todos los derechos reservados.</p>
                    <div className="flex gap-4">
                        <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Términos y Condiciones</a>
                        <a href="#" className="text-sm text-gray-600 hover:text-blue-600">Política de Privacidad</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

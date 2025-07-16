'use client';
import {useState} from "react";
import Button from "@/components/ui/Button";
import { Ticket, Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: '#rifas', label: 'Rifas Activas' },
        { href: '#como-funciona', label: '¿Cómo Funciona?' },
        { href: '#ganadores', label: 'Ganadores' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <a href="#" className="flex items-center gap-2">
                    <Ticket className="h-7 w-7 text-blue-600" />
                    <span className="font-bold text-xl text-gray-800">RifaWeb</span>
                </a>
                <nav className="hidden md:flex gap-6">
                    {navLinks.map(link => (
                        <a key={link.href} href={link.href} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                            {link.label}
                        </a>
                    ))}
                </nav>
                <div className="hidden md:flex items-center gap-2">
                    <Button variant="ghost">Iniciar Sesión</Button>
                    <Button>Registrarse</Button>
                </div>
                <div className="md:hidden">
                    <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </Button>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <nav className="flex flex-col items-center gap-4 p-4">
                        {navLinks.map(link => (
                            <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-gray-600 hover:text-blue-600 transition-colors">
                                {link.label}
                            </a>
                        ))}
                        <div className="flex flex-col w-full gap-2 mt-2">
                            <Button variant="ghost" className="w-full">Iniciar Sesión</Button>
                            <Button className="w-full">Registrarse</Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;
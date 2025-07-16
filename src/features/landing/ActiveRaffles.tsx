import {mockRaffles} from "@/types";
import {RaffleCard} from "@/features/landing/RaffleCard";

export const ActiveRaffles = () => {
    return (
        <section id="rifas" className="w-full py-20 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Rifas Activas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mockRaffles.map(raffle => (
                        <RaffleCard key={raffle.id} raffle={raffle} />
                    ))}
                </div>
            </div>
        </section>
    );
};
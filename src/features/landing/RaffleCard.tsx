import {Raffle} from "@/types";
import Card from "@/components/ui/Card";
import {Calendar, ChevronRight, Gift} from "lucide-react";
import Button from "@/components/ui/Button";

export const RaffleCard = ({ raffle }: { raffle: Raffle }) => {
    const progress = (raffle.numbersSold / raffle.totalNumbers) * 100;

    return (
        <Card className="flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300">
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800">{raffle.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{raffle.type} dígitos</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Gift size={16} />
                    <span>Premio: {raffle.prize.name} (${raffle.prize.amount.toLocaleString()})</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar size={16} />
                    <span>Sorteo: {raffle.drawDate}</span>
                </div>
            </div>
            <div className="px-5 pb-5 mt-auto">
                {progress >= 80 && (
                    <div className="w-full mb-2">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Vendidos</span>
                            <span>{raffle.numbersSold} / {raffle.totalNumbers}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}
                <Button className="w-full mt-4">
                    Comprar por ${raffle.pricePerNumber} <ChevronRight size={16} className="ml-1" />
                </Button>
            </div>
        </Card>
    );
};
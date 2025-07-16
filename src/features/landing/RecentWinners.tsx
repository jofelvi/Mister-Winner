import {mockWinners} from "@/types";
import Card from "@/components/ui/Card";
import {Star} from "lucide-react";

export const RecentWinners = () => {
    return (
        <section id="ganadores" className="w-full py-20 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Últimos Ganadores</h2>
                <div className="max-w-3xl mx-auto space-y-4">
                    {mockWinners.map((winner, index) => (
                        <Card key={index} className="p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-100 text-green-600 p-3 rounded-full">
                                    <Star size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{winner.name}</p>
                                    <p className="text-sm text-gray-500">Ganó en &#34;{winner.raffleTitle}&#34;</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-green-600">${winner.prizeAmount.toLocaleString()}</p>
                                <p className="text-sm text-gray-500">Número: {winner.winningNumber}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
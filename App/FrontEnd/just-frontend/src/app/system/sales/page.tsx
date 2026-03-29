import { SquarePercent } from 'lucide-react'

export default function PageSales () {
    return (
        <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold mb-4">Ventas</h1>
            <p>Aquí puedes gestionar tus Ventas.</p>
                <SquarePercent size={48} className="text-gray-500 mt-4" />
        </div>
    )
}
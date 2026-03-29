import { CirclePile } from 'lucide-react'

export default function PageInventory () {
    return (
        <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold mb-4">Inventario</h1>
            <p>Aquí puedes gestionar tu inventario</p>
                <CirclePile size={48} className="text-gray-500 mt-4" />
        </div>
    )
}
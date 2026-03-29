import { User } from 'lucide-react'

export default function PageClients () {
    return (
        <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold mb-4">Clientes</h1>
            <p>Aquí puedes gestionar tus Clientes</p>
                <User size={48} className="text-gray-500 mt-4" />
        </div>
    )
}
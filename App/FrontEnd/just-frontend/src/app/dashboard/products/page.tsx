import { Apple } from 'lucide-react'

export default function PageProducts () {
    return (
        <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold mb-4">Productos</h1>
            <p>Aquí puedes gestionar tus productos.</p>
                <Apple size={48} className="text-gray-500 mt-4" />
        </div>
    )
}
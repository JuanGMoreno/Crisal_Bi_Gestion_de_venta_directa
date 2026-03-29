import { UserRoundPen } from 'lucide-react'

export default function PageProfile () {
    return (
        <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold mb-4">Perfil</h1>
            <p>Aquí puedes gestionar tu perfil.</p>
                <UserRoundPen size={48} className="text-gray-500 mt-4" />
        </div>
    )
}
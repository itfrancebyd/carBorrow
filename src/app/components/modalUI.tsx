'use client'
import { useRouter } from "next/navigation";

const Modal = ({ children }: {
    children: React.ReactNode;
}) => {
    const router = useRouter()
    return (
        <div className="bg-gray-50/70 z-50 absolute top-0 bottom-0 left-0 right-0">
            <div className="bg-white shadow-xl rounded-2xl z-50 absolute top-1/8 bottom-1/8 left-1/8 right-1/8 px-6 py-6">
                <button onClick={() => router.back()} className="">X</button>
                {children}
            </div>
        </div>
    )
}

export default Modal
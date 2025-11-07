'use client'
import { useRouter } from "next/navigation";

const Modal = ({ title, children }: {
    title: string;
    children: React.ReactNode;
}) => {
    const router = useRouter()
    return (
        <div className="bg-[#8C8C8C]/70 z-50 fixed top-0 bottom-0 left-0 right-0">
            <div className="bg-white shadow-xl rounded-2xl z-50 absolute top-1/8 bottom-1/8 left-1/8 right-1/8 py-6 overflow-y-auto">
                <div className="text-sm flex justify-between pb-3 px-6 border-b-1 border-[#dadada]">
                    <div className="flex flex-row gap-2 items-center">
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8620" width="16" height="16"><path d="M919.68 949.12H103.68a96 96 0 0 1-96-96V167.04a96 96 0 0 1 96-96H384a95.36 95.36 0 0 1 72.96 33.92l56.32 64a33.28 33.28 0 0 0 24.32 10.88h378.88a96 96 0 0 1 96.64 96v576a96 96 0 0 1-93.44 97.28zM103.68 135.04a32 32 0 0 0-32 32v686.08a32 32 0 0 0 32 32h816a32.64 32.64 0 0 0 32-32v-576a32 32 0 0 0-32-32H540.8a99.2 99.2 0 0 1-74.24-33.28l-56.32-64a33.92 33.92 0 0 0-26.24-12.8z" fill="#26361C" p-id="8621"></path><path d="M945.28 374.4H78.08a32 32 0 1 1 0-64h867.2a32 32 0 0 1 0 64z" fill="#26361C" p-id="8622"></path></svg>
                        <div>{title}</div>
                    </div>
                    <button onClick={() => router.back()} className="cursor-pointer">X</button>
                </div>
                <div className="px-6 pt-3">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal
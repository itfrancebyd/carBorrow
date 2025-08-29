'use client'
import { useRouter } from "next/navigation";
import { FC, useState } from "react"

interface tableGridProp {
    formTitle: string,
    tableTitle: Array<string>
    tableContent: Record<string, string>[]; // safer type
}

const TableGrid: FC<tableGridProp> = ({ formTitle, tableTitle, tableContent }) => {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const handleClick = () => {
        setIsOpen(!isOpen)
    }
    return (
        <div className="relative h-full text-[#494949]">
            <div className="bg-white h-full py-5 px-8 rounded-xl overflow-y-scroll">
                <div className="font-semibold text-lg py-5">{formTitle}</div>
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="h-10 bg-[#26361C] text-white">
                            {tableTitle.map((title, index) =>
                                <th key={index} className="text-start px-3">{title}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent.map((item, index) => (
                            <tr onClick={handleClick} key={index} className="h-10 border-b-2 border-[#F3F5F7] hover:bg-[#B6C6A1] hover:cursor-pointer">
                                {tableTitle.map((field: string) => (
                                    <td key={field} className="px-3">{item[field as keyof typeof item]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={`${isOpen ? 'absolute top-1 left-1 w-full h-full bg-white z-40 p-7' : 'hidden'} `}>
                popupwindow
                <button onClick={handleClick} className="text-3xl hover:cursor-pointer absolute right-6">x</button>
            </div>
        </div>
    )
}

export default TableGrid
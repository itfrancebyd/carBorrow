'use client'

import { FC } from "react";

interface DataBlockProps {
    color: string;
    title: string;
    dataCount: number
}
export const DataBlock: FC<DataBlockProps> = ({ color, title, dataCount }) => {
    return (
        <div className="flex flex-col gap-2 border-r-1 border-[#26361C]">
            <div className="flex flex-row items-center gap-1">
                <div className={`${color} w-2 h-2 rounded-full`}></div>
                <div className="text-xs text-gray-500">{title}: </div>
            </div>
            <div className="text-xl font-semibold text-[#26361C]">{dataCount}</div>
        </div>
    )
}

const DataMeasure = ({ dataMeasure }: { dataMeasure: any }) => {
    return (
        <div className="mx-6 my-4 px-4 py-4 gap-6 border border-gray-400 rounded-md grid grid-cols-3">
            {dataMeasure.map((item: any, index: number) => (
                <DataBlock key={index} color={item.color} title={item.title} dataCount={item.dataCount}></DataBlock>
            ))}
        </div>
    )
}

export default DataMeasure
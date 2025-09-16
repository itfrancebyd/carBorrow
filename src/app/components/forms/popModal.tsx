import { createClient } from "@/utils/supabase/client";
import { FC, useEffect, useState } from "react"

interface PopModalFormProp {
    currentID: string;
    closeEvent: () => void;
    fetchData: (id: string) => Promise<any>;
    tableTitle: Array<{ key: string; label: string; }>
}

const PopModalForm: FC<PopModalFormProp> = ({ currentID, closeEvent, fetchData, tableTitle }) => {
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!currentID) return

        setLoading(true)
        setError(null)

        fetchData(currentID)
            .then((res) => setData(res))
            .catch((err) => {
                console.error("Failed to fetch data:", err);
                setError(err instanceof Error ? err.message : "Something went wrong");
            })
            .finally(() => setLoading(false))
    }, [currentID, fetchData])

    return (
        <div className="bg-white w-1/3 h-full absolute right-0 top-0 shadow-2xl">
            <div className="mt-3 mx-6">
                <button onClick={closeEvent} className="text-3xl hover:cursor-pointer absolute right-6">
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6469" width="32" height="32"><path d="M551.424 512l195.072-195.072c9.728-9.728 9.728-25.6 0-36.864l-1.536-1.536c-9.728-9.728-25.6-9.728-35.328 0L514.56 475.136 319.488 280.064c-9.728-9.728-25.6-9.728-35.328 0l-1.536 1.536c-9.728 9.728-9.728 25.6 0 36.864L477.696 512 282.624 707.072c-9.728 9.728-9.728 25.6 0 36.864l1.536 1.536c9.728 9.728 25.6 9.728 35.328 0L514.56 548.864l195.072 195.072c9.728 9.728 25.6 9.728 35.328 0l1.536-1.536c9.728-9.728 9.728-25.6 0-36.864L551.424 512z" fill="#26361C" p-id="6470"></path></svg>
                </button>
                <div className="pt-7">
                    <div className="text-[#26361C] font-extrabold border-b-1 pb-2">Vehicle Model Info</div>
                    {error && (
                        <div className="text-red-600 font-medium mt-2">
                            Error: {error}
                        </div>
                    )}
                    {loading && (
                        <div>...</div>
                    )}
                    {!error && !loading && data && (
                        <div className="mt-4 p-2 text-xs">
                            <form className="flex flex-col gap-2">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[#26361C] font-semibold">Vehicle Id:</label>
                                    <input readOnly value={currentID} className="border border-[#26361C] bg-[#bac7b2] px-2 py-1 rounded-sm"></input>
                                </div>
                                {tableTitle.map((item, index) => (
                                    <div key={index} className="flex flex-col gap-1">
                                        <label className="text-[#26361C] font-semibold">{item.label}</label>
                                        <input
                                            value={data[item.key]}
                                            className="border border-[#26361C] px-2 py-1 rounded-sm"
                                            onChange={(e) =>
                                                setData((prev: any) => ({
                                                    ...prev,
                                                    [item.key]: e.target.value,
                                                }))
                                            }
                                        ></input>
                                    </div>
                                ))}
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default PopModalForm
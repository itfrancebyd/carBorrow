import { FC, useEffect, useState } from "react"
interface PopModalFormProp {
    currentID?: string;
    closeEvent?: () => void;
    fetchData: (id: string) => Promise<any>;
    popupWindowInfo: Array<{ key: string; label: string; }>;
    actionDelete: any;
    actionEdit: any;
    selectInfo: any
}

const PopModalForm: FC<PopModalFormProp> = ({
    currentID,
    closeEvent,
    fetchData,
    popupWindowInfo,
    actionDelete,
    actionEdit,
    selectInfo
}) => {
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [isEdit, setEdit] = useState(false)

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

    const handleDelete = () => {
        actionDelete(currentID)
        alert("Deleted successfully")
        window.location.href = '/model'
    }
    const handleEdit = () => {
        setEdit(true)
    }
    const handleCancel = () => {
        setEdit(false)
    }
    const handleSave = async (event: React.MouseEvent) => {
        event.preventDefault()
        try {
            await actionEdit("vehicle_model", currentID, data)
            alert("Changes saved successfully")
            setEdit(false)
            window.location.href = '/model'
        } catch (err) {
            alert("Failed to save changes")
        }
    }

    return (
        <div className="bg-white w-1/3 h-screen absolute right-0 top-0 bottom-0 shadow-2xl">
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
                        <div>Loading...</div>
                    )}
                    {!error && !loading && data && (
                        <div className="p-2 text-xs">
                            <div className="my-1 flex gap-2">
                                <button
                                    className="bg-[#26361C] hover:bg-[#375a23] py-1 px-1 rounded-sm cursor-pointer"
                                    onClick={handleDelete}
                                >
                                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4888" width="16" height="16"><path d="M254.398526 804.702412l-0.030699-4.787026C254.367827 801.546535 254.380106 803.13573 254.398526 804.702412zM614.190939 259.036661c-22.116717 0-40.047088 17.910928-40.047088 40.047088l0.37146 502.160911c0 22.097274 17.930371 40.048111 40.047088 40.048111s40.048111-17.950837 40.048111-40.048111l-0.350994-502.160911C654.259516 276.948613 636.328122 259.036661 614.190939 259.036661zM893.234259 140.105968l-318.891887 0.148379-0.178055-41.407062c0-22.13616-17.933441-40.048111-40.067554-40.048111-7.294127 0-14.126742 1.958608-20.017916 5.364171-5.894244-3.405563-12.729929-5.364171-20.031219-5.364171-22.115694 0-40.047088 17.911952-40.047088 40.048111l0.188288 41.463344-230.115981 0.106424c-3.228531-0.839111-6.613628-1.287319-10.104125-1.287319-3.502777 0-6.89913 0.452301-10.136871 1.296529l-73.067132 0.033769c-22.115694 0-40.048111 17.950837-40.048111 40.047088 0 22.13616 17.931395 40.048111 40.048111 40.048111l43.176358-0.020466 0.292666 617.902982 0.059352 0 0 42.551118c0 44.233434 35.862789 80.095199 80.095199 80.095199l40.048111 0 0 0.302899 440.523085-0.25685 0-0.046049 40.048111 0c43.663452 0 79.146595-34.95 80.054267-78.395488l-0.329505-583.369468c0-22.135136-17.930371-40.047088-40.048111-40.047088-22.115694 0-40.047088 17.911952-40.047088 40.047088l0.287549 509.324054c-1.407046 60.314691-18.594497 71.367421-79.993892 71.367421l41.575908 1.022283-454.442096 0.26606 52.398394-1.288343c-62.715367 0-79.305207-11.522428-80.0645-75.308173l0.493234 76.611865-0.543376 0-0.313132-660.818397 236.82273-0.109494c1.173732 0.103354 2.360767 0.166799 3.561106 0.166799 1.215688 0 2.416026-0.063445 3.604084-0.169869l32.639375-0.01535c1.25355 0.118704 2.521426 0.185218 3.805676 0.185218 1.299599 0 2.582825-0.067538 3.851725-0.188288l354.913289-0.163729c22.115694 0 40.050158-17.911952 40.050158-40.047088C933.283394 158.01792 915.349953 140.105968 893.234259 140.105968zM774.928806 815.294654l0.036839 65.715701-0.459464 0L774.928806 815.294654zM413.953452 259.036661c-22.116717 0-40.048111 17.910928-40.048111 40.047088l0.37146 502.160911c0 22.097274 17.931395 40.048111 40.049135 40.048111 22.115694 0 40.047088-17.950837 40.047088-40.048111l-0.37146-502.160911C454.00054 276.948613 436.069145 259.036661 413.953452 259.036661z" fill="#ffffff" p-id="4889"></path></svg>
                                </button>
                                <button
                                    className="bg-[#26361C] hover:bg-[#375a23] py-1 px-1 rounded-sm cursor-pointer"
                                    onClick={handleEdit}
                                >
                                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5267" width="16" height="16"><path d="M526.41 117.029v58.514a7.314 7.314 0 0 1-7.315 7.314H219.429a36.571 36.571 0 0 0-35.987 29.989l-0.585 6.583V804.57a36.571 36.571 0 0 0 29.989 35.987l6.583 0.585H804.57a36.571 36.571 0 0 0 35.987-29.989l0.585-6.583v-317.44a7.314 7.314 0 0 1 7.314-7.314h58.514a7.314 7.314 0 0 1 7.315 7.314v317.44a109.714 109.714 0 0 1-99.182 109.203l-10.533 0.512H219.43a109.714 109.714 0 0 1-109.203-99.182l-0.512-10.533V219.43a109.714 109.714 0 0 1 99.182-109.203l10.533-0.512h299.666a7.314 7.314 0 0 1 7.314 7.315z m307.345 31.817l41.4 41.399a7.314 7.314 0 0 1 0 10.313L419.985 655.726a7.314 7.314 0 0 1-10.313 0l-41.399-41.4a7.314 7.314 0 0 1 0-10.312l455.168-455.168a7.314 7.314 0 0 1 10.313 0z" p-id="5268" fill="#ffffff"></path></svg>
                                </button>
                            </div>
                            <form className="flex flex-col gap-2">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[#26361C] font-semibold">Vehicle Id:</label>
                                    <input readOnly value={currentID} className="border border-[#26361C] bg-[#bac7b2] px-2 py-1 rounded-sm"></input>
                                </div>
                                {popupWindowInfo.map((title, index) => (
                                    <div key={index} className="flex flex-col gap-1">
                                        <label className="text-[#26361C] font-semibold">{title.label}</label>
                                        <select
                                            disabled={!isEdit}
                                            value={data[title.key]}
                                            className={`border border-[#26361C] px-2 py-1 rounded-sm ${isEdit ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                            onChange={(e) =>
                                                setData((prev: any) => ({
                                                    ...prev,
                                                    [title.key]: e.target.value,
                                                }))
                                            }
                                        >
                                            {(selectInfo[title.label] ?? []).map((item: string) => (
                                                <option key={item} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                                {isEdit ?
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={handleCancel} className="bg-white text-[#26361C] border border-[#26361C] py-1 cursor-pointer">Cancel</button>
                                        <button onClick={handleSave} className="bg-[#26361C] text-white py-1 cursor-pointer">Save</button>
                                    </div>
                                    :
                                    ''}
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default PopModalForm
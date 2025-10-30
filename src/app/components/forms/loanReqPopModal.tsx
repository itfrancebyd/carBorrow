import { FC, useEffect, useState } from "react"
import { GetFormById } from "@/utils/jotform/server"
import { answerContent } from "@/app/(home)/loan-requests/page"
import Link from "next/link";

interface LoanReqPopModalProp {
    modelInfo?: Record<string, string[]>;
    currentID?: string;
    closeEvent?: () => void;
    fetchData?: (id: string) => Promise<any>;
    popupWindowInfo: Array<{ key: string; label: string }>;
    actionDelete?: any;
    actionEdit?: any;
}

type PopUpInputProps = {
    title: { key: string };
    data: Record<string, any>;
    isEdit: boolean;
    setData: React.Dispatch<React.SetStateAction<any>>;
    selectKeys: string[];
    immutableKeys: string[];
    dateType: string[];
    statusOptions: string[] | [];
};

const PopUpInput = ({
    title,
    data,
    isEdit,
    setData,
    selectKeys,
    immutableKeys,
    dateType,
    statusOptions,
}: PopUpInputProps) => {
    if (!title || !title.key) return null

    const isDisabled = immutableKeys.includes(title.key) || !isEdit

    const commonClass = `border border-[#26361C] ${immutableKeys.includes(title.key) ? "bg-[#bac7b2]" : ""
        } px-2 py-1 rounded-sm ${isEdit ? "cursor-pointer" : "cursor-text"}`

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setData((prev: any) => ({
            ...prev,
            [title.key]: e.target.value,
        }))
    }
    const normalizeDate = (dateStr: string): string => {
        if (!dateStr) return ""
        // already ISO
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
        // otherwise, assume MM-DD-YYYY
        const [month, day, year] = dateStr.split("-")
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
    }


    switch (true) {
        case selectKeys.includes(title.key):
            return (
                <select
                    disabled={isDisabled}
                    value={data[title.key]}
                    className={commonClass}
                    onChange={handleChange}
                >
                    <option value="" disabled>
                        -- select status --
                    </option>
                    {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            )

        case dateType.includes(title.key):
            return (
                <input
                    type="date"
                    disabled={isDisabled}
                    value={normalizeDate(data[title.key] ?? "")}
                    className={commonClass}
                    onChange={handleChange}
                />
            )

        case title.key == "loan_reason":
            return (
                <textarea
                    disabled={isDisabled}
                    value={data[title.key] ?? ""}
                    className={commonClass}
                    rows={5}
                ></textarea>
            )
        case title.key == "licence_photo":
            return (
                <Link
                    href={data[title.key] ?? ""}
                    className={`px-2 py-1 rounded-sm cursor-default underline underline-offset-2 flex flex-row gap-1`}
                    target="_blank"
                >
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4662" width="16" height="16"><path d="M607.934444 417.856853c-6.179746-6.1777-12.766768-11.746532-19.554358-16.910135l-0.01228 0.011256c-6.986111-6.719028-16.47216-10.857279-26.930349-10.857279-21.464871 0-38.864146 17.400299-38.864146 38.864146 0 9.497305 3.411703 18.196431 9.071609 24.947182l-0.001023 0c0.001023 0.001023 0.00307 0.00307 0.005117 0.004093 2.718925 3.242857 5.953595 6.03853 9.585309 8.251941 3.664459 3.021823 7.261381 5.997598 10.624988 9.361205l3.203972 3.204995c40.279379 40.229237 28.254507 109.539812-12.024871 149.820214L371.157763 796.383956c-40.278355 40.229237-105.761766 40.229237-146.042167 0l-3.229554-3.231601c-40.281425-40.278355-40.281425-105.809861 0-145.991002l75.93546-75.909877c9.742898-7.733125 15.997346-19.668968 15.997346-33.072233 0-23.312962-18.898419-42.211381-42.211381-42.211381-8.797363 0-16.963347 2.693342-23.725354 7.297197-0.021489-0.045025-0.044002-0.088004-0.066515-0.134053l-0.809435 0.757247c-2.989077 2.148943-5.691629 4.669346-8.025791 7.510044l-78.913281 73.841775c-74.178443 74.229608-74.178443 195.632609 0 269.758863l3.203972 3.202948c74.178443 74.127278 195.529255 74.127278 269.707698 0l171.829484-171.880649c74.076112-74.17435 80.357166-191.184297 6.282077-265.311575L607.934444 417.856853z" fill="#26361C" p-id="4663"></path><path d="M855.61957 165.804257l-3.203972-3.203972c-74.17742-74.178443-195.528232-74.178443-269.706675 0L410.87944 334.479911c-74.178443 74.178443-78.263481 181.296089-4.085038 255.522628l3.152806 3.104711c3.368724 3.367701 6.865361 6.54302 10.434653 9.588379 2.583848 2.885723 5.618974 5.355985 8.992815 7.309476 0.025583 0.020466 0.052189 0.041956 0.077771 0.062422l0.011256-0.010233c5.377474 3.092431 11.608386 4.870938 18.257829 4.870938 20.263509 0 36.68962-16.428158 36.68962-36.68962 0-5.719258-1.309832-11.132548-3.645017-15.95846l0 0c-4.850471-10.891048-13.930267-17.521049-20.210297-23.802102l-3.15383-3.102664c-40.278355-40.278355-24.982998-98.79612 15.295358-139.074476l171.930791-171.830507c40.179095-40.280402 105.685018-40.280402 145.965419 0l3.206018 3.152806c40.279379 40.281425 40.279379 105.838513 0 146.06775l-75.686796 75.737962c-10.296507 7.628748-16.97358 19.865443-16.97358 33.662681 0 23.12365 18.745946 41.87062 41.87062 41.87062 8.048303 0 15.563464-2.275833 21.944801-6.211469 0.048095 0.081864 0.093121 0.157589 0.141216 0.240477l1.173732-1.083681c3.616364-2.421142 6.828522-5.393847 9.529027-8.792247l79.766718-73.603345C929.798013 361.334535 929.798013 239.981676 855.61957 165.804257z" fill="#26361C" p-id="4664"></path></svg>
                    <p className="cursor-pointer">Licence Photo Link</p>
                </Link>
            )

        default:
            return (
                <input
                    type="text"
                    disabled={isDisabled}
                    value={data[title.key] ?? ""}
                    className={commonClass}
                    onChange={handleChange}
                />
            )
    }
}

const LoanReqPopModal: FC<LoanReqPopModalProp> = ({
    modelInfo,
    currentID,
    closeEvent,
    fetchData,
    popupWindowInfo,
    actionDelete,
    actionEdit,
}) => {
    const [data, setData] = useState<Record<string, any> | null>(null)
    const [originalData, setOriginalData] = useState<Record<string, any> | null>(null);
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [isEdit, setEdit] = useState(false)

    const immutableKeys = [
        "id",
        "request_date",
        "applicant",
        "applicant_department",
        "loan_intended",
        "loan_reason",
        "driver_name",
        "license_no",
        "licence_obtained_date",
        "licence_issue_city",
        "licence_expiration_date",
        "licence_photo"
    ]
    const dateType = ["request_date", "licence_obtained_date", "licence_expiration_date", "loan_start_date", "loan_end_date"]
    const selectKeys = ["prefered_model"]
    const statusOptions = modelInfo ? modelInfo["Model Name"] : []

    useEffect(() => {
        if (!currentID) return
        const fetchFormData = async () => {
            const submissionData = await GetFormById(currentID)
            if (submissionData) {
                const answersContent = submissionData.content
                Object.keys(answersContent).forEach(() => {
                    const answers = answersContent.answers as Record<number, any>
                    const formattedAnswers = {
                        id: answersContent.id,
                        request_date: answers[9]?.prettyFormat ?? "",
                        applicant: `${answers[3]?.answer?.first ?? ""} ${answers[3]?.answer?.last ?? ""}`,
                        applicant_department: answers[65]?.answer ?? "",
                        loan_start_date: answers[61]?.prettyFormat ?? "",
                        loan_end_date: answers[64]?.prettyFormat ?? "",
                        loan_intended: answers[78]?.answer ?? "",
                        loan_reason: answers[80]?.answer ?? "",
                        driver_name: answers[16]?.answer ?? "",
                        license_no: answers[19]?.answer ?? "",
                        licence_obtained_date: answers[82]?.prettyFormat ?? "",
                        licence_issue_city: answers[83]?.answer ?? "",
                        licence_expiration_date: answers[84]?.prettyFormat ?? "",
                        licence_photo: answers[86]?.answer?.[0] ?? "",
                        prefered_model: answers[88]?.answer ?? "",
                    } as answerContent
                    setData(formattedAnswers)
                })
            }
        }
        fetchFormData()
    }, [currentID])

    useEffect(() => {
        if (!currentID || !fetchData) return

        setLoading(true)
        setError(null)

        fetchData(currentID)
            .then((res) => { setData(res[0]); setOriginalData(res[0]) })
            .catch((err) => {
                console.error("Failed to fetch data:", err);
                setError(err instanceof Error ? err.message : "Something went wrong");
            })
            .finally(() => setLoading(false))
    }, [currentID, fetchData])

    const handleDelete = () => {
        actionDelete(currentID)
        alert("Deleted successfully")
        window.location.href = '/'
    }
    const handleEdit = () => {
        setEdit(true)
    }
    const handleCancel = () => {
        setEdit(false)
    }
    const handleSave = async (event: React.MouseEvent) => {
        event.preventDefault()

        if (!data || !originalData) return
        const updatePayload: Record<string, any> = {}
        Object.keys(data).forEach((key) => {
            if (data[key] !== originalData[key]) {
                updatePayload[key] = data[key]
            }
        })

        try {
            await actionEdit("car_fleet", currentID, updatePayload)
            alert("Changes saved successfully")
            setEdit(false)
            window.location.href = '/'
        } catch (err) {
            alert("Failed to save changes")
        }
    }

    return (
        <div className="bg-white w-1/3 h-screen absolute right-0 top-0 bottom-0 shadow-2xl overflow-y-auto">
            <div className="my-3 mx-6">
                <button onClick={closeEvent} className="text-3xl hover:cursor-pointer absolute right-6">
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6469" width="32" height="32"><path d="M551.424 512l195.072-195.072c9.728-9.728 9.728-25.6 0-36.864l-1.536-1.536c-9.728-9.728-25.6-9.728-35.328 0L514.56 475.136 319.488 280.064c-9.728-9.728-25.6-9.728-35.328 0l-1.536 1.536c-9.728 9.728-9.728 25.6 0 36.864L477.696 512 282.624 707.072c-9.728 9.728-9.728 25.6 0 36.864l1.536 1.536c9.728 9.728 25.6 9.728 35.328 0L514.56 548.864l195.072 195.072c9.728 9.728 25.6 9.728 35.328 0l1.536-1.536c9.728-9.728 9.728-25.6 0-36.864L551.424 512z" fill="#26361C" p-id="6470"></path></svg>
                </button>
                <div className="pt-7">
                    <div className="text-[#26361C] font-extrabold border-b-1 pb-2">Vehicle Info</div>
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
                                {popupWindowInfo.map((title, index) => (
                                    <div key={index} className="flex flex-col gap-1">
                                        <label className="text-[#26361C] font-semibold">{title.label}</label>
                                        <PopUpInput
                                            title={title}
                                            isEdit={isEdit}
                                            setData={setData}
                                            data={data}
                                            selectKeys={selectKeys}
                                            immutableKeys={immutableKeys}
                                            dateType={dateType}
                                            statusOptions={statusOptions}
                                        />
                                    </div>
                                ))}
                                {isEdit ?
                                    <div className="grid grid-cols-2 gap-2 mt-2">
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

export default LoanReqPopModal
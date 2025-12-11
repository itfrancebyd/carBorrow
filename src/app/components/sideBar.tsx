'use client'
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAppContext } from "./context"

const SideBar = () => {
    const [isCurrentUserEmail, setCurrentUserEmail] = useState<string | null>(null)
    const [isUserLoading, setUserLoading] = useState(false)
    const [isAdmin, setAdmin] = useState(false)
    const { isCurrentUser } = useAppContext()
    const pathname = usePathname()
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const getCurrentUser = async () => {
            setUserLoading(true)
            const { data, error } = await supabase.auth.getUser()
            if (error) {
                console.error("use not find: " + error)
            } else {
                if (data.user?.email) {
                    setCurrentUserEmail(data.user.email)
                    setUserLoading(false)
                }
            }
        }
        const show_log = () => {
            if (isCurrentUser) {
                if (isCurrentUser.user_metadata.role === 'admin') {
                    setAdmin(true)
                }
            }
        }
        getCurrentUser()
        show_log()
    }, [isCurrentUser])

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <div className="bg-white grid grid-rows-11 py-5 px-1 lg:px-4 h-full justify-items-stretch border-r-[1px] border-gray-400/20 shadow-xl">
            <div className="row-span-1 font-extrabold text-xl text-center lg:text-start px-3">
                <p className="hidden lg:inline">MMCar</p>
                <p className="lg:hidden inline text-center">M</p>
            </div>
            <div className="row-span-9 flex flex-col gap-2 justify-start text-xs lg:text-sm font-semibold">
                <Link className={`flex flex-row justify-center lg:justify-start lg:gap-2 text-[#26361C] py-3 lg:py-2 px-3 rounded-md ${pathname == '/' ? 'bg-[#B6C6A1]' : 'hover:bg-[#e1e6d9]'}`} href="/">
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5580" width="16" height="16"><path d="M908.288 833.536H146.432c-57.344 0-103.424-46.08-103.424-103.424v-163.84c0-57.344 46.08-103.424 103.424-103.424h762.88c57.344 0 103.424 46.08 103.424 103.424v164.864c-1.024 56.32-47.104 102.4-104.448 102.4zM146.432 520.192c-25.6 0-45.056 20.48-45.056 45.056v164.864c0 25.6 20.48 45.056 45.056 45.056h762.88c25.6 0 45.056-20.48 45.056-45.056v-163.84c0-25.6-20.48-45.056-45.056-45.056H146.432z" fill="#26361C" p-id="5581"></path><path d="M257.024 750.592c-56.32 0-102.4-46.08-102.4-102.4s46.08-102.4 102.4-102.4 102.4 46.08 102.4 102.4-46.08 102.4-102.4 102.4z m0-142.336c-22.528 0-39.936 18.432-39.936 39.936s18.432 39.936 39.936 39.936 39.936-18.432 39.936-39.936-18.432-39.936-39.936-39.936zM797.696 750.592c-56.32 0-102.4-46.08-102.4-102.4s46.08-102.4 102.4-102.4 102.4 46.08 102.4 102.4-46.08 102.4-102.4 102.4z m0-142.336c-22.528 0-39.936 18.432-39.936 39.936s18.432 39.936 39.936 39.936 39.936-18.432 39.936-39.936-17.408-39.936-39.936-39.936z" fill="#26361C" p-id="5582"></path><path d="M871.424 516.096H183.296l50.176-224.256c10.24-47.104 56.32-80.896 107.52-80.896h372.736c52.224 0 97.28 33.792 107.52 80.896l50.176 224.256z m-626.688-49.152h565.248l-36.864-164.864c-5.12-24.576-30.72-43.008-59.392-43.008H340.992c-28.672 0-54.272 17.408-59.392 43.008l-36.864 164.864z" fill="#26361C" p-id="5583"></path><path d="M253.952 983.04c-19.456 0-35.84-16.384-35.84-35.84v-71.68c0-19.456 16.384-35.84 35.84-35.84s35.84 16.384 35.84 35.84v71.68c0 20.48-15.36 35.84-35.84 35.84zM800.768 983.04c-19.456 0-35.84-16.384-35.84-35.84v-71.68c0-19.456 16.384-35.84 35.84-35.84s35.84 16.384 35.84 35.84v71.68c-1.024 20.48-16.384 35.84-35.84 35.84z" fill="#26361C" p-id="5584"></path></svg>
                    <div className="hidden lg:inline">Vehicles</div>
                </Link>
                <Link className={`flex flex-row justify-center lg:justify-start lg:gap-2 text-[#26361C] py-3 lg:py-2 px-3 rounded-md  ${pathname == '/loan-requests' ? 'bg-[#B6C6A1]' : 'hover:bg-[#e1e6d9]'}`} href="/loan-requests">
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8596" width="16" height="16"><path d="M682.666667 128.170667h128c49.322667 0 86.954667 42.752 86.954666 93.696v665.770666c0 50.901333-37.674667 93.738667-86.954666 93.738667H215.893333c-49.322667 0-86.997333-42.794667-86.997333-93.738667V221.866667c0-50.944 37.546667-93.696 86.997333-93.696H341.333333V64a21.333333 21.333333 0 0 1 42.666667 0v170.666667a21.333333 21.333333 0 0 1-42.666667 0V170.837333H215.893333c-24.533333 0-44.330667 22.485333-44.330666 51.029334v665.770666c0 28.501333 19.84 51.072 44.330666 51.072H810.666667c24.448 0 44.288-22.613333 44.288-51.072V221.866667c0-28.501333-19.797333-51.029333-44.288-51.029334h-128V234.666667a21.333333 21.333333 0 1 1-42.666667 0v-170.666667a21.333333 21.333333 0 1 1 42.666667 0v64.170667z" p-id="8597" fill="#26361C"></path><path d="M447.872 170.666667h127.786667a21.333333 21.333333 0 1 0 0-42.666667h-127.786667a21.333333 21.333333 0 1 0 0 42.666667zM341.632 384h341.333333a21.333333 21.333333 0 0 0 0-42.666667h-341.333333a21.333333 21.333333 0 0 0 0 42.666667zM341.632 554.666667h170.666667a21.333333 21.333333 0 1 0 0-42.666667h-170.666667a21.333333 21.333333 0 1 0 0 42.666667zM341.632 725.333333h341.077333a21.333333 21.333333 0 1 0 0-42.666666H341.632a21.333333 21.333333 0 1 0 0 42.666666z" p-id="8598" fill="#26361C"></path></svg>
                    <div className="hidden lg:inline">Loan Requests</div>
                </Link>
                <Link className={`flex flex-row justify-center lg:justify-start lg:gap-2 text-[#26361C] py-3 lg:py-2 px-3 rounded-md  ${pathname == '/model' ? 'bg-[#B6C6A1]' : 'hover:bg-[#e1e6d9]'}`} href="/model">
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10609" width="16" height="16"><path d="M945.371429 427.154286a22.820571 22.820571 0 0 1-22.784 22.820571l-30.281143 5.12c10.422857 20.589714 15.725714 43.410286 15.469714 66.56l0.512 6.217143h-258.56v109.714286h-85.284571v140.8H243.273143v50.688a40.594286 40.594286 0 0 1-40.594286 40.594285H140.726857a40.594286 40.594286 0 0 1-40.630857-40.594285v-157.549715c0-2.486857 0.256-4.937143 0.731429-7.350857a101.668571 101.668571 0 0 1-0.731429-11.556571l11.373714-130.998857c0-25.490286 5.558857-47.213714 15.286857-66.413715l-30.866285-5.229714A22.710857 22.710857 0 0 1 73.142857 427.154286v-19.785143a22.747429 22.747429 0 0 1 22.784-22.784h81.700572c3.949714 0 7.826286 1.097143 11.227428 3.145143l36.864-111.36C235.776 223.780571 273.846857 182.857143 336.530286 182.857143h345.965714c54.528 0 99.072 30.427429 110.738286 93.549714l36.864 110.921143a21.321143 21.321143 0 0 1 10.642285-2.852571h81.700572a22.747429 22.747429 0 0 1 22.784 22.784v19.931428h0.146286zM238.153143 590.994286a61.44 61.44 0 1 0 68.278857 102.217143 61.44 61.44 0 0 0-68.278857-102.180572z m471.405714-136.996572c29.366857 0 64.621714-23.222857 66.852572-52.443428l-10.057143-40.192-27.428572-73.874286c-1.901714-10.349714-5.485714-14.555429-10.861714-20.845714a167.936 167.936 0 0 1-6.070857-7.350857H298.422857c-2.304 2.925714-4.388571 5.266286-6.326857 7.387428-5.412571 5.997714-9.216 10.203429-11.190857 20.918857l-0.475429 1.682286-26.953143 71.936-10.057142 40.155429c2.084571 29.403429 37.485714 52.662857 66.852571 52.662857h399.323429zM877.714286 859.428571h-142.226286V804.571429H877.714286v54.857142z" p-id="10610" fill="#26361C"></path><path d="M877.714286 640h-170.642286V585.142857H877.714286v54.857143zM621.714286 749.714286h256V694.857143h-256v54.857143z" p-id="10611" fill="#26361C"></path></svg>
                    <div className="hidden lg:inline">Manage Models</div>
                </Link>
                {isAdmin &&
                    <Link className={`flex flex-row justify-center lg:justify-start lg:gap-2 text-[#26361C] py-3 lg:py-2 px-3 rounded-md  ${pathname == '/logs' ? 'bg-[#B6C6A1]' : 'hover:bg-[#e1e6d9]'}`} href="/logs">
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9056" width="16" height="16"><path d="M916 770.3H106c-11 0-20-9-20-20V167.7c0-11 9-20 20-20h810c11 0 20 9 20 20v582.6c0 11.1-9 20-20 20z m-780-50h750V197.7H136v522.6z" p-id="9057" fill="#26361C"></path><path d="M349.5 635c-13.8 0-25-11.2-25-25V395.3c0-13.8 11.2-25 25-25s25 11.2 25 25V610c0 13.9-11.1 25-25 25zM523.4 635.3c-13.8 0-25-11.2-25-25V285.5c0-13.8 11.2-25 25-25s25 11.2 25 25v324.8c0 13.8-11.2 25-25 25zM697.1 635.3c-13.8 0-25-11.2-25-25V366c0-13.8 11.2-25 25-25s25 11.2 25 25v244.3c0 13.8-11.2 25-25 25zM821.6 876.5H212.3c-13.8 0-25-11.2-25-25s11.2-25 25-25h609.2c13.8 0 25 11.2 25 25s-11.1 25-24.9 25z" p-id="9058" fill="#26361C"></path></svg>
                        <div className="hidden lg:inline">Logs</div>
                    </Link>
                }
            </div>
            <div className="row-span-1 justify-self-stretch self-end w-full">
                <div className="flex flex-col gap-2 items-center lg:items-start border-t border-gray-200 pt-3">
                    {/* Current user info */}
                    <div className="flex items-center gap-2 text-gray-600 text-xs lg:text-sm w-full justify-center lg:justify-start">
                        {isUserLoading ? (
                            <>
                                <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />
                                <span className="hidden lg:inline-block w-[100px] h-3 rounded-md bg-gray-200 animate-pulse" />
                            </>
                        ) : (
                            <>
                                <div className="flex w-7 h-7 items-center justify-center rounded-full bg-[#B6C6A1] text-[#26361C] font-semibold shadow-sm">
                                    {isCurrentUserEmail?.charAt(0)?.toUpperCase()}
                                </div>
                                <span className="hidden lg:inline truncate max-w-[120px] font-medium text-[#26361C] text-xs">
                                    {isCurrentUserEmail}
                                </span>
                            </>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center lg:justify-start gap-2 py-2 px-2 mt-1 text-[#26361C] border border-[#26361C]/30 rounded-md hover:bg-[#e1e6d9] hover:text-[#1c2814] transition-colors duration-150 cursor-pointer"
                    >
                        <svg
                            viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            className="flex-shrink-0"
                        >
                            <path
                                d="M960.512 539.712l-144.768 144.832-48.256-48.256 60.224-60.288H512V512h325.76l-70.272-70.272 48.256-48.256 144.768 144.768-0.704 0.768 0.704 0.704zM704 192a64 64 0 0 0-64-64H192a64 64 0 0 0-64 64v640a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64v-64h64v64a128 128 0 0 1-128 128H192a128 128 0 0 1-128-128V192a128 128 0 0 1 128-128h448a128 128 0 0 1 128 128v128h-64V192z"
                                fill="#26361C"
                            />
                        </svg>
                        <span className="hidden lg:inline font-semibold text-sm">Log out</span>
                    </button>
                </div>
            </div>

        </div>
    )
}

export default SideBar
import NewLoanRequest from "@/app/components/forms/newLoanRequestForm"
import Modal from "@/app/components/modalUI"

const Page = () => {
    return (
        <Modal title="Add New Loan Requests">
            <NewLoanRequest></NewLoanRequest>
        </Modal>
    )
}

export default Page
import Modal from "@/app/components/modalUI"
import NewModelForm from "@/app/components/forms/newModelForm"

const Page = () => {
    return (
        <Modal title="Add New Vehicle Model">
            <NewModelForm></NewModelForm>
        </Modal>
    )
}

export default Page
import Modal from "@/app/components/modalUI"
import NewVehiclesForm from "@/app/components/forms/newVehiclesForm"

const Page = () => {
    return (
        <Modal title="Add New Vehicle">
            <NewVehiclesForm></NewVehiclesForm>
        </Modal>
    )
}

export default Page
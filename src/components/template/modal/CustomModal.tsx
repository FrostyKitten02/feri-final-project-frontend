import {CustomModalErrorProps} from "../../../interfaces";

export const CustomModal = () => {
  return(
      <>
      </>
  )
}
export const CustomModalHeader = () => {
  return(
      <>
      </>
  )
}

export const CustomModalBody = () => {
  return(
      <>
      </>
  )
}
export const CustomModalFooter = () => {
  return(
      <>
      </>
  )
}
export const CustomModalError = ({error}: CustomModalErrorProps) => {
  return(
      <div className="text-red-500 h-4 text-xs pt-1 font-semibold">
          {error}
      </div>
  )
}
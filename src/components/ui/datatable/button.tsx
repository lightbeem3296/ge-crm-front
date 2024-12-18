import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface ButtonProps {
  disabled?: boolean,
  onClick: () => void,
}

export function SaveButton({ disabled = false, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      className={`px-2 py-0 w-fit border  rounded-sm text-sm duration-300 ${disabled
        ? "bg-gray-100 border-gray-200 cursor-not-allowed"
        : "border-blue-600/10 bg-blue-600/5 hover:bg-blue-600/10 hover:border-blue-600/15"}`
      }
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faSave} className={`${disabled ? "text-gray-400" : "text-blue-600"}`} />
    </button >
  );
}

export function DeleteButton({ disabled = false, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      className={`px-2 py-0 w-fit  border rounded-sm text-sm duration-300 ${disabled
        ? "bg-gray-100 border-gray-200 cursor-not-allowed"
        : "border-red-600/10 bg-red-600/5 hover:bg-red-600/10 hover:border-red-600/15"}`
      }
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faTrash} className={`${disabled ? "text-gray-400" : "text-red-600"}`} />
    </button >
  );
}

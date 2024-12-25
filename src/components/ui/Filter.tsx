import { Dispatch, SetStateAction } from "react";

interface FilterProps {
  label: string,
  setValue: Dispatch<SetStateAction<any>>,
}

export default function Filter({ label }: FilterProps) {
  return (
    <div>
      {label}
    </div>
  );
}

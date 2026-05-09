import { StepBack } from "lucide-react"

type Props = {
    setStep: React.Dispatch<React.SetStateAction<number>>;
}
const PrevButton = ({ setStep }: Props) => {

    const handlePrevClick = () => {
        setStep((prev) => {
            if(prev > 0) return prev - 1;

            return prev;
        })
    }
        
  return (
        <div className="cursor-pointer text-primary-foreground bg-accent-foreground rounded p-1" onClick={handlePrevClick}>
            <StepBack />
        </div>
    )
}

export default PrevButton
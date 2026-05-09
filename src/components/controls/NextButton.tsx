import { StepForward } from "lucide-react"

type Props = {
    statesLength: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}
const NextButton = ({setStep, statesLength }: Props) => {

    const handleNextClick = () => {
        setStep((prev) => {
            if(prev < statesLength - 1) return prev + 1;

            return prev;
        })
    }
        
  return (
        <div className="cursor-pointer text-primary-foreground bg-accent-foreground rounded p-1" onClick={handleNextClick}>
            <StepForward />
        </div>
    )
}

export default NextButton
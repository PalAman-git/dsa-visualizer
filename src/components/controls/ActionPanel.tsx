import NextButton from "./NextButton";
import PlayButton from "./PlayButton";
import PrevButton from "./PrevButton";

type Props = {
    className?: string;
    step: number;
    statesLength: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}

const ActionPanel = ({ className, step, statesLength, setStep }: Props) => {
    return (
        <div className={`flex justify-center gap-4 ${className}`}>
            <PrevButton setStep={setStep} />
            <PlayButton step={step} setStep={setStep} statesLength={statesLength} />
            <NextButton setStep={setStep} statesLength={statesLength} />
        </div>
    )
}

export default ActionPanel
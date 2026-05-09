import NextButton from "./NextButton";
import PlayButton from "./PlayButton";
import PrevButton from "./PrevButton";

type Props = {
    step:number;
    statesLength:number;
    setStep:React.Dispatch<React.SetStateAction<number>>;
}

const ActionPanel = ({step,statesLength,setStep}:Props) => {
  return (
    <div className="flex justify-center gap-4">
        <PrevButton setStep={setStep} />
        <PlayButton step={step} setStep={setStep} statesLength={statesLength} />
        <NextButton setStep={setStep} statesLength={statesLength} />
    </div>
  )
}

export default ActionPanel
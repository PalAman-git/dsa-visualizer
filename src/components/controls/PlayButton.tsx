import { Play, Pause } from "lucide-react";
import { useState, useRef } from "react";

type Props = {
    step: number;
    statesLength: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
};

const PlayButton = ({ step, statesLength, setStep }: Props) => {
    const [play, setPlay] = useState<"play" | "pause">("pause");
    const intervalRef = useRef<number | null>(null);

    const pauseAnimation = () => {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const playAnimation = () => {
        if (intervalRef.current !== null) return;

        intervalRef.current = window.setInterval(() => {
            setStep((prev) => {
                if (prev >= statesLength - 1) {
                    pauseAnimation();
                    setPlay("pause");

                    return prev;
                }

                return prev + 1;
            });
        }, 1000);
    };

    const handleToggle = () => {
        if (play === "pause") {
            if (step >= statesLength - 1) {
                setStep(0);
            }

            setPlay("play");
            playAnimation();
        } else {
            setPlay("pause");
            pauseAnimation();
        }
    };

    return (
        <div
            className="cursor-pointer text-primary-foreground bg-accent-foreground rounded p-1"
            onClick={handleToggle}
        >
            {play === "play" ? <Pause /> : <Play />}
        </div>
    );
};

export default PlayButton;
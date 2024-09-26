"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Timer, Pause, Play, RotateCcw } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { timerSchema } from "@/utils/zodSchema";

export function GymTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState("");
  const [errors, setErrors] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && time > 0) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, time]);

  const durationInSeconds = parseInt(duration, 10);
  const validationResult = timerSchema.safeParse(durationInSeconds);

  const startTimer = () => {
    if (isNaN(durationInSeconds) || !durationInSeconds) {
      setErrors("Please enter a valid number");
      return;
    } else if (!validationResult.success) {
      setErrors(validationResult.error.errors[0].message);
      return;
    }

    setErrors("");

    if (time === 0) {
      setTime(durationInSeconds);
    }
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    if (isNaN(durationInSeconds) || !durationInSeconds) {
      setErrors("Please enter a valid number");
      return;
    } else if (!validationResult.success) {
      setErrors(validationResult.error.errors[0].message);
      return;
    }

    setIsActive(false);
    setTime(durationInSeconds || 0);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(e.target.value);
    setErrors("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-3 left-3 rounded-full border border-[#26252a] h-12 w-12"
        >
          <Timer className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Timer</DialogTitle>
          <DialogDescription className="hidden">Timer dialog</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={handleDurationChange}
              placeholder="Enter seconds (1-600)"
              className="text-black"
            />
          </div>
          <div className="flex justify-center items-center text-4xl font-bold">
            {formatTime(time)}
          </div>
          <div className="flex justify-center space-x-2">
            {!isActive ? (
              <Button
                onClick={startTimer}
                variant={"secondary"}
                className="w-full"
              >
                <Play className="mr-1 h-5 w-5" /> Start
              </Button>
            ) : (
              <Button
                type="button"
                onClick={pauseTimer}
                variant={"secondary"}
                className="w-full"
              >
                <Pause className="mr-1 h-5 w-5" /> Pause
              </Button>
            )}
            <Button
              onClick={resetTimer}
              variant={"secondary"}
              className="w-full"
            >
              <RotateCcw className="mr-1 h-5 w-5" /> Reset
            </Button>
          </div>
          {errors && (
            <Alert variant="destructive">
              <AlertDescription>{errors}</AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

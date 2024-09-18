"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Timer, Pause, Play, RotateCcw } from "lucide-react";

export function GymTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState("");
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

  const startTimer = () => {
    const durationInSeconds = parseInt(duration, 10);
    if (time === 0 && durationInSeconds > 0) {
      setTime(durationInSeconds);
      setIsActive(true);
    } else if (!isActive && time > 0) {
      setIsActive(true);
    }
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(parseInt(duration, 10) || 0);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuration(e.target.value);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const disablesButton =
    !duration || parseInt(duration) <= 0 || parseInt(duration) > 600;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-3 left-3 rounded-full border border-[#26252a]"
        >
          <Timer className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rest Timer</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={handleDurationChange}
              placeholder="Enter seconds (1-600)"
            />
          </div>
          <div className="flex justify-center items-center text-4xl font-bold">
            {formatTime(time)}
          </div>
          <div className="flex justify-center space-x-2">
            {!isActive ? (
              <Button onClick={startTimer} disabled={disablesButton}>
                <Play className="mr-2 h-5 w-5" /> Start
              </Button>
            ) : (
              <Button onClick={pauseTimer}>
                <Pause className="mr-2 h-5 w-5" /> Pause
              </Button>
            )}
            <Button onClick={resetTimer} disabled={disablesButton}>
              <RotateCcw className="mr-2 h-5 w-5" /> Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

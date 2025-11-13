import { Button, ButtonGroup } from "@chakra-ui/react";

type Props = { mode: "free" | "challenge"; setMode: (m: "free" | "challenge") => void };

export const ModeToggle = ({ mode, setMode }: Props) => (
  <ButtonGroup>
    <Button onClick={() => setMode("free")} variant={mode === "free" ? "solid" : "outline"}>Libre</Button>
    <Button onClick={() => setMode("challenge")} variant={mode === "challenge" ? "solid" : "outline"}>Challenge</Button>
  </ButtonGroup>
);

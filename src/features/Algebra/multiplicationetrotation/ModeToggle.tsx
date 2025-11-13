import { Button, ButtonGroup } from "@chakra-ui/react";

type Props = { mode: "free" | "challenge" | "powersOfI"; setMode: (m: "free" | "challenge" | "powersOfI") => void };

export const ModeToggle = ({ mode, setMode }: Props) => (
  <ButtonGroup mb={4}>
    <Button onClick={() => setMode("free")} variant={mode === "free" ? "solid" : "outline"}>Libre</Button>
    <Button onClick={() => setMode("challenge")} variant={mode === "challenge" ? "solid" : "outline"}>Challenge</Button>
    <Button onClick={() => setMode("powersOfI")} variant={mode === "powersOfI" ? "solid" : "outline"}>Puissances de i</Button>
  </ButtonGroup>
);

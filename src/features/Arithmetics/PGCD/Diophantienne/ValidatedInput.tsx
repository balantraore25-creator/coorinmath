import { useState, useRef, useEffect } from "react";
import {
  HStack,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";

interface ValidatedInputProps {
  expected: number;                 // valeur attendue
  onSuccess: () => void;            // callback pour passer à l’étape suivante
  label?: string;                   // texte d’accompagnement
}

export const ValidatedInput = ({ expected, onSuccess, label }: ValidatedInputProps) => {
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  // ✅ Ref pour focus automatique
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // focus dès le montage

  const handleValidate = () => {
    const num = Number(value);

    if (num === expected) {
      setFeedback("correct");
      setTimeout(() => {
        setFeedback(null);
        setValue("");
        onSuccess(); // ✅ passage à l’étape suivante
      }, 600);
    } else {
      setFeedback("wrong");
    }
  };

  return (
    <HStack gap={3}>
      {label && <Text>{label}</Text>}

      <Input
        ref={inputRef} // ✅ focus auto
        placeholder="?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        width="80px"
        variant="outline"
      />

      <Button onClick={handleValidate} colorScheme="teal">
        Valider
      </Button>

      {feedback === "correct" && (
        <Text color="green.600" fontWeight="bold">✅</Text>
      )}
      {feedback === "wrong" && (
        <Text color="red.600" fontWeight="bold">❌</Text>
      )}
    </HStack>
  );
};

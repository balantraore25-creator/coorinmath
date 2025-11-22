"use client"

import { Select, createListCollection } from "@chakra-ui/react"

// ⚡ ajoute "export" devant ton type
export type Transformation =
  | "translation"
  | "symmetryCenter"
  | "symmetryOrigin"
  | "conjugate"
  | "rotationOrigin"
  | "rotationCenter"
  | "symmetryOblique"
  | "homothety"

interface ControlsProps {
  onSelect: (value: Transformation) => void;
}

const transformations = createListCollection({
  items: [
    { label: "Translation", value: "translation" },
    { label: "Symétrie centrale", value: "symmetryCenter" },
    { label: "Symétrie origine", value: "symmetryOrigin" },
    { label: "Conjugué", value: "conjugate" },
    { label: "Rotation origine", value: "rotationOrigin" },
    { label: "Rotation autour de a", value: "rotationCenter" },
    { label: "Symétrie oblique", value: "symmetryOblique" },
    { label: "Homothétie", value: "homothety" },
  ],
})

export default function Controls({ onSelect }: ControlsProps) {
  return (
    <Select.Root
      collection={transformations}
      width="320px"
      onValueChange={(details) => {
        const val = details.value[0]
        onSelect(val as Transformation)
      }}
    >
      <Select.HiddenSelect />
      <Select.Label>Choisir une transformation</Select.Label>

      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Sélectionner..." />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>

      <Select.Positioner>
        <Select.Content>
          {transformations.items.map((item) => (
            <Select.Item item={item} key={item.value}>
              {item.label}
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  )
}

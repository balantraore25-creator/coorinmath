import { Select, createListCollection, Portal } from "@chakra-ui/react"
import { ROLE_ITEMS, type Role } from "./roles" // adapte le chemin

const rolesCollection = createListCollection({ items: ROLE_ITEMS })

export interface RoleSelectProps {
  value: Role[]
  onChange: (roles: Role[]) => void
  placeholder?: string
}

export function RoleSelect({ value, onChange, placeholder = 'Choisir un ou plusieurs rôles' }: RoleSelectProps) {
  return (
    <Select.Root
      multiple
      collection={rolesCollection} // ✅ maintenant obligatoire et présent
      value={value}
      onValueChange={({ value }) => onChange(value as Role[])}
    >
      <Select.HiddenSelect name="roles" />
      <Select.Label>Rôles</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={placeholder} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {rolesCollection.items.map((item) => (
              <Select.Item key={item.value} item={item}>
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}


import { useCategories } from "@/hooks/useCategories";
import { FC } from "react";
import Box from "../ui/Box";
import Checkbox from "../ui/Checkbox";
import Text from "../ui/Text";

interface CategoryPickerProps {
  value: number[];
  onChange: (value: number[]) => void;
  label?: string;
}

const CategoryPicker: FC<CategoryPickerProps> = ({ label, value, onChange }) => {
  const { categories, isLoading } = useCategories();

  return (
    <Box>
      <Box mb="l">
        <Text variant="body">{label}</Text>
      </Box>
      <Box ml="l" borderTopWidth={1} borderTopColor="mainBorder" flex={1}>
        {!isLoading &&
          categories?.results?.map((category) => (
            <Box
              key={category.id}
              py="m"
              borderBottomWidth={1}
              borderBottomColor="mainBorder"
              justifyContent="space-between"
              flexDirection="row"
            >
              <Box>
                <Text>{category.name}</Text>
              </Box>
              <Checkbox
                value={value.includes(category.id)}
                accent
                onChange={(checked) => {
                  if (checked) {
                    onChange([...value, category.id]);
                  } else {
                    onChange(value.filter((v) => v !== category.id));
                  }
                }}
              />
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default CategoryPicker;

import { useNetwork } from "@/contexts/network";
import { useQuery } from "@tanstack/react-query";
import { FC, useMemo, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import ChoiceList from "./ChoiceList";
import SearchbarFilter from "./Filter";

interface CategoryFilterProps {
  title: string;
  values?: number[];
  onChange?: (values: number[]) => void;
}

const CategoryFilter: FC<CategoryFilterProps> = ({ title, values, onChange }) => {
  const [selected, setSelected] = useState<number[]>(values || []);
  const { client } = useNetwork();

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await client.GET("/categories");
      return response.data;
    },
  });

  function toggleChoice(value: number) {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  }

  const label = useMemo(() => {
    if (!values || values.length === 0) {
      return title;
    }

    return values
      .map((value) => (data?.results || []).find((option) => option.id === value)?.name)
      .join(", ");
  }, [data, title, values]);

  return (
    <SearchbarFilter
      title={title}
      label={values && values?.length > 0 ? label : title}
      selected={values && values?.length > 0}
      onReset={() => setSelected([])}
      onConfirm={() => onChange && onChange(selected)}
    >
      <ScrollView style={{ maxHeight: "90%" }}>
        <ChoiceList>
          {data?.results?.map((option) => (
            <ChoiceList.Item
              key={option.id}
              label={option.name}
              selected={selected.includes(option.id)}
              onPress={() => toggleChoice(option.id)}
            />
          ))}
        </ChoiceList>
      </ScrollView>
    </SearchbarFilter>
  );
};

export default CategoryFilter;

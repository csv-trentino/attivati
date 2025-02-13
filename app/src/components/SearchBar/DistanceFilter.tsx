import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import ChoiceList from "./ChoiceList";
import SearchbarFilter from "./Filter";

interface DistanceFilterProps {
  title: string;
  value?: number | null;
  onChange?: (value: number | null) => void;
}

const DistanceFilter: FC<DistanceFilterProps> = ({ title, onChange, value }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<number | null>(value || null);

  function translateDistance(distance: number | null) {
    switch (distance) {
      case 5:
        return t("distanceFilter.5km", "5 km");
      case 10:
        return t("distanceFilter.10km", "10 km");
      case 20:
        return t("distanceFilter.25km", "25 km");
      case 50:
        return t("distanceFilter.50km", "50 km");
      case 100:
        return t("distanceFilter.100km", "100 km");
      default:
        return t("distanceFilter.all", "Everywhere");
    }
  }

  const options = [null, 5, 10, 20, 50, 100];

  function toggleChoice(value: number | null) {
    if (selected === value) {
      setSelected(null);
    } else {
      setSelected(value);
    }
  }

  return (
    <SearchbarFilter
      title={title}
      label={value ? translateDistance(value) : title}
      selected={!!value}
      onReset={() => {
        setSelected(null);
      }}
      onConfirm={() => {
        onChange && onChange(selected);
      }}
    >
      <ChoiceList>
        {options.map((value) => (
          <ChoiceList.Item
            key={value}
            label={translateDistance(value)}
            selected={selected === value}
            onPress={() => {
              toggleChoice(value);
            }}
          />
        ))}
      </ChoiceList>
    </SearchbarFilter>
  );
};

export default DistanceFilter;

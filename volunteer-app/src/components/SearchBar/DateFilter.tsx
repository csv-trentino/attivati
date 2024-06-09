import { format } from "date-fns";
import { FC, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "../ui/Box";
import InputText from "../ui/InputText";
import Text from "../ui/Text";
import ChoiceList from "./ChoiceList";
import SearchbarFilter from "./Filter";

enum DateIntervalEnum {
  AnyDate = "anyDate",
  Today = "today",
  Tomorrow = "tomorrow",
  ThisWeek = "thisWeek",
  ThisMonth = "thisMonth",
}

export interface DateInterval {
  from: string | null;
  to: string | null;
}

interface DateFilterProps {
  title: string;
  value?: DateInterval | null;
  onChange?: (value: DateInterval | null) => void;
}

const DateFilter: FC<DateFilterProps> = ({ title, value, onChange }) => {
  const { t } = useTranslation();
  const [showCustomDates, setShowCustomDates] = useState(false);

  function translateDateIntervalEnum(interval: DateIntervalEnum) {
    switch (interval) {
      case DateIntervalEnum.AnyDate:
        return t("anyDate", "Any date");
      case DateIntervalEnum.Today:
        return t("today", "Today");
      case DateIntervalEnum.Tomorrow:
        return t("tomorrow", "Tomorrow");
      case DateIntervalEnum.ThisWeek:
        return t("thisWeek", "This week");
      case DateIntervalEnum.ThisMonth:
        return t("thisMonth", "This month");
    }
  }

  function dateIntervalToString(interval: DateInterval) {
    let string = [];

    if (interval.from && interval.to && interval.from === interval.to) {
      return format(new Date(interval.from), "dd/MM/yyyy");
    }

    if (interval.from) {
      string.push(format(new Date(interval.from), "dd/MM/yyyy"));
    }

    if (interval.to) {
      string.push(format(new Date(interval.to), "dd/MM/yyyy"));
    }

    return string.join(" - ");
  }

  const options = useMemo(generateDefaultPeriods, [t]);

  return (
    <SearchbarFilter
      title={showCustomDates ? t("chooseDates", "Choose dates") : title}
      label={value ? dateIntervalToString(value) : title}
      selected={!!value}
      onConfirm={console.log}
      onBack={showCustomDates ? () => setShowCustomDates(false) : undefined}
      onReset={() => {
        onChange && onChange(null);
      }}
    >
      {showCustomDates ? (
        <Box paddingTop="m">
          <Box
            paddingHorizontal="m"
            height={58}
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text variant="body">{t("form", "From")}:</Text>
            <Box width={135}>
              <InputText
                value={value?.from || ""}
                onChangeText={(from) => {
                  onChange && onChange({ to: value?.to || null, from: from || null });
                }}
                size="s"
                placeholder="DD/MM/YYYY"
              />
            </Box>
          </Box>
          <Box
            paddingHorizontal="m"
            height={58}
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text variant="body">{t("to", "To")}:</Text>
            <Box width={135}>
              <InputText
                value={value?.from || ""}
                onChangeText={(to) => {
                  onChange && onChange({ from: value?.from || null, to: to || null });
                }}
                size="s"
                placeholder="DD/MM/YYYY"
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <ChoiceList>
          {options.map((option) => (
            <ChoiceList.Item
              key={option.label}
              label={translateDateIntervalEnum(option.label)}
              selected={value?.from === option.value.from && value?.to === option.value.to}
              onPress={() => {
                onChange && onChange(option.value);
              }}
            />
          ))}
          <ChoiceList.Item
            label={t("customDates", "Custom dates")}
            section
            onPress={() => {
              setShowCustomDates(true);
            }}
          />
        </ChoiceList>
      )}
    </SearchbarFilter>
  );
};

function generateDefaultPeriods() {
  return [
    {
      label: DateIntervalEnum.AnyDate,
      value: {
        from: null,
        to: null,
      },
    },
    {
      label: DateIntervalEnum.Today,
      value: {
        from: new Date().toISOString().split("T")[0],
        to: new Date().toISOString().split("T")[0],
      },
    },
    {
      label: DateIntervalEnum.Tomorrow,
      value: {
        from: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0],
        to: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0],
      },
    },
    {
      label: DateIntervalEnum.ThisWeek,
      value: {
        from: new Date(new Date().setDate(new Date().getDate() - new Date().getDay()))
          .toISOString()
          .split("T")[0],
        to: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 6))
          .toISOString()
          .split("T")[0],
      },
    },
    {
      label: DateIntervalEnum.ThisMonth,
      value: {
        from: new Date(new Date().setDate(1)).toISOString().split("T")[0],
        to: new Date(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0))
          .toISOString()
          .split("T")[0],
      },
    },
  ];
}

export default DateFilter;
import { convertToDDMMYYYY, convertToYYYYMMDD } from "@/utils/formatters";
import { FC, useState } from "react";
import { TextInputProps } from "react-native";
import InputText, { InputTextProps } from "./InputText";

const InputTextDate: FC<InputTextProps & TextInputProps> = ({ value, onChangeText, ...rest }) => {
  const [displayValue, setDisplayValue] = useState(convertToDDMMYYYY(value || ""));

  function handleChange(text: string) {
    function maskDate(value: string) {
      value = value.replace(/\D/g, ""); // Rimuove qualsiasi carattere non numerico
      value = value.replace(/^(\d{2})(\d)/g, "$1/$2"); // Aggiunge lo slash dopo i primi due numeri (giorno)
      value = value.replace(/(\/\d{2})(\d)/g, "$1/$2"); // Aggiunge lo slash dopo il mese, solo se sono già presenti i primi due numeri
      value = value.replace(/(\d{4})\d+?$/, "$1"); // Limita l'anno a 4 cifre
      return value;
    }
    const maskedValue = maskDate(text);

    setDisplayValue(maskDate(maskedValue));

    if (maskedValue && (maskedValue.length === 10 || maskedValue.length === 0)) {
      const convertedValue = convertToYYYYMMDD(maskedValue);

      if (convertedValue !== null) {
        onChangeText && onChangeText(convertedValue);
      }
    }
  }

  return (
    <InputText
      keyboardType="numeric"
      maxLength={10}
      placeholder="GG/MM/AAAA"
      {...rest}
      onChangeText={handleChange}
      value={displayValue || ""}
    />
  );
};

export default InputTextDate;

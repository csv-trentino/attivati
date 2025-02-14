import { convertToDDMMYYYY, convertToYYYYMMDD } from "@/utils/formatters";
import { useBottomSheetInternal } from "@gorhom/bottom-sheet";
import { FC, useCallback, useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputFocusEventData, TextInputProps } from "react-native";
import InputText, { InputTextProps } from "./InputText";

const BottomSheetInputTextDate: FC<InputTextProps & TextInputProps> = ({
  value,
  onChangeText,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [displayValue, setDisplayValue] = useState(convertToDDMMYYYY(value || ""));

  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

  //#region callbacks
  const handleOnFocus = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = true;
      if (onFocus) {
        onFocus(args);
      }
    },
    [onFocus, shouldHandleKeyboardEvents],
  );
  const handleOnBlur = useCallback(
    (args: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = false;
      if (onBlur) {
        onBlur(args);
      }
    },
    [onBlur, shouldHandleKeyboardEvents],
  );
  //#endregion

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

  //#region effects
  useEffect(() => {
    return () => {
      // Reset the flag on unmount
      shouldHandleKeyboardEvents.value = false;
    };
  }, [shouldHandleKeyboardEvents]);
  //#endregion

  return (
    <InputText
      keyboardType="numeric"
      maxLength={10}
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      placeholder="GG/MM/AAAA"
      {...rest}
      onChangeText={handleChange}
      value={displayValue || ""}
    />
  );
};

export default BottomSheetInputTextDate;

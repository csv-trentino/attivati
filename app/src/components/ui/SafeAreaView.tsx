import { ViewStyle } from "react-native";
import { SafeAreaView as BaseSafeAreaView } from "react-native-safe-area-context";

interface SafeAreaViewProps {
  children?: React.ReactNode | React.ReactNode[];
  style?: ViewStyle;
}

export default function SafeAreaView({ children, style }: SafeAreaViewProps) {
  return (
    <BaseSafeAreaView
      style={{
        backgroundColor: "#FFFFFF",
        width: "100%",
        flex: 1,
        ...style,
      }}
    >
      {children}
    </BaseSafeAreaView>
  );
}

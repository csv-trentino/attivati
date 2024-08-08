import Svg, { Path } from "react-native-svg";
import Box from "./Box";

interface IconProps {
  color?: string;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ color, size }) => {
  return (
    <Box width={35} height={32}>
      <Svg viewBox="0 0 24 24">
        <Path
          d="M5.83333 18.6666V23.3333M7 4.66663V9.33329M8.16667 21H3.5M9.33333 6.99996H4.66667M15.1667 4.66663L17.2116 9.85172C17.4309 10.4076 17.5405 10.6855 17.7083 10.9199C17.8571 11.1276 18.039 11.3095 18.2467 11.4583C18.4811 11.6261 18.759 11.7358 19.3149 11.955L24.5 14L19.3149 16.0449C18.759 16.2642 18.4811 16.3738 18.2467 16.5416C18.039 16.6904 17.8571 16.8723 17.7083 17.08C17.5405 17.3144 17.4309 17.5923 17.2116 18.1482L15.1667 23.3333L13.1217 18.1482C12.9025 17.5923 12.7928 17.3144 12.625 17.08C12.4762 16.8723 12.2943 16.6904 12.0866 16.5416C11.8522 16.3738 11.5743 16.2642 11.0184 16.0449L5.83333 14L11.0184 11.955C11.5743 11.7358 11.8522 11.6261 12.0866 11.4583C12.2943 11.3095 12.4762 11.1276 12.625 10.9199C12.7928 10.6855 12.9025 10.4076 13.1217 9.85173L15.1667 4.66663Z"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          stroke={color}
        />
      </Svg>
    </Box>
  );
};

export default Icon;

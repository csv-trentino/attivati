import Icon from "@/components/ui/Icon";
import { Theme } from "@/config/theme";
import { useNetwork } from "@/contexts/network";
import { useTheme } from "@shopify/restyle";
import { useQueryClient } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
import { Pressable } from "react-native";

const FavoriteButton: FC<{
  id: number;
  isFavorite: boolean;
  refetch: () => void;
}> = ({ id, isFavorite, refetch }) => {
  const [_isFavorite, setIsFavorite] = useState(isFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme<Theme>();
  const { client } = useNetwork();

  const queryClient = useQueryClient();

  useEffect(() => {
    setIsFavorite(isFavorite);
  }, [isFavorite]);

  const handleAddToFavorite = async (organizationId: number) => {
    setIsLoading(true);
    await client.POST("/organizations/{id}/favorite", {
      params: {
        path: {
          id: organizationId,
        },
      },
    });
    setIsLoading(false);
    setIsFavorite(true);

    queryClient.invalidateQueries({
      queryKey: [],
      type: "all",
    });

    refetch();
  };

  const handleRemoveFromFavorite = async (organizationId: number) => {
    setIsLoading(true);
    await client.DELETE("/organizations/{id}/favorite", {
      params: {
        path: {
          id: organizationId,
        },
      },
    });
    setIsLoading(false);
    setIsFavorite(false);

    queryClient.invalidateQueries({
      queryKey: [],
      type: "all",
    });

    refetch();
  };

  if (isLoading) {
    return (
      <Icon
        name="heart"
        fill={theme.colors.lightBorder}
        size={48}
        color={theme.colors.lightBorder}
      />
    );
  }

  if (_isFavorite) {
    return (
      <Pressable onPress={() => handleRemoveFromFavorite(id)}>
        <Icon
          name="heart"
          fill={theme.colors.accentText}
          size={48}
          color={theme.colors.accentText}
        />
      </Pressable>
    );
  }

  return (
    <Pressable onPress={() => handleAddToFavorite(id)}>
      <Icon name="heart" size={48} color={theme.colors.accentText} />
    </Pressable>
  );
};

export default FavoriteButton;

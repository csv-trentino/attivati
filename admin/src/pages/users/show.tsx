import { ImageField, NumberField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const UserShow = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <ImageField value={record?.avatar} />
      <Title level={5}>{"ID"}</Title>
      <NumberField value={record?.id || "---"} />
      <Title level={5}>{"First Name"}</Title>
      <TextField value={record?.first_name || "---"} />
      <Title level={5}>{"Last Name"}</Title>
      <TextField value={record?.last_name || "---"} />
      <Title level={5}>{"Email"}</Title>
      <TextField value={record?.email || "---"} />
      <Title level={5}>{"Phone"}</Title>
      <TextField value={record?.phone || "---"} />
      <Title level={5}>{"Is Superuser"}</Title>
      <TextField value={record?.is_superuser ? "Yes" : "No"} />
    </Show>
  );
};

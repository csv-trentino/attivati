import {
  NumberField,
  Show,
  TextField
} from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const ActivityShow = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;


  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <NumberField value={record?.id || "---"} />
      <Title level={5}>{"User"}</Title>
      <TextField value={record?.user?.email} />
      <Title level={5}>{"Experience"}</Title>
      <TextField value={record?.experience?.title || "---"} />
      <Title level={5}>{"Created at"}</Title>
      <TextField value={new Date(record?.created_at).toLocaleDateString() || "---"} />
      <Title level={5}>{"Updated at"}</Title>
      <TextField value={new Date(record?.updated_at).toLocaleDateString() || "---"} /> 
      <Title level={5}>{"Status"}</Title>
      <TextField value={record?.status || "---"} />
      <Title level={5}>{"Message"}</Title>
      <TextField value={record?.message || "---"} />
      <Title level={5}>{"Start Date"}</Title>
      <TextField value={new Date(record?.start_date).toLocaleDateString() || "---"} />
      <Title level={5}>{"End Date"}</Title>
      <TextField value={new Date(record?.end_date).toLocaleDateString() || "---"} />
      <Title level={5}>{"Start Time"}</Title>
      <TextField value={record?.start_time || "---"} />
      <Title level={5}>{"End Time"}</Title>
      <TextField value={record?.end_time || "---"} />
    </Show>
  );
};

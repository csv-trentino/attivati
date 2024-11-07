import {
  NumberField,
  Show,
  TextField
} from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const ExperienceShow = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;
  
  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <NumberField value={record?.id || "---"} />
      <Title level={5}>{"Title"}</Title>
      <TextField value={record?.title || "---"} />
      <Title level={5}>{"Description"}</Title>
      <TextField value={record?.description || "---"} />
      <Title level={5}>{"Category"}</Title>
      <TextField value={record?.category?.name || "---"} />
      <Title level={5}>{"City"}</Title>
      <TextField value={record?.city || "---"} />
      <Title level={5}>{"Start Date"}</Title>
      <TextField value={new Date(record?.start_date).toLocaleDateString() || "---"} />
      <Title level={5}>{"End Date"}</Title>
      <TextField value={new Date(record?.end_date).toLocaleDateString() || "---"} />
      <Title level={5}>{"Start Time"}</Title>
      <TextField value={record?.start_time || "---"} />
      <Title level={5}>{"End Time"}</Title>
      <TextField value={record?.end_time || "---"} />
      <Title level={5}>{"Published"}</Title>
      <TextField value={record?.published || "---"} />
      <Title level={5}>{"Organization"}</Title>
      <TextField value={record?.organization?.name || "---"} />
      <Title level={5}>{"Latitude"}</Title>
      <TextField value={record?.latitude || "---"} />
      <Title level={5}>{"Longitude"}</Title>
      <TextField value={record?.longitude || "---"} />
      <Title level={5}>{"Address"}</Title>
      <TextField value={record?.address || "---"} />
      <Title level={5}>{"State"}</Title>
      <TextField value={record?.state || "---"} />
      <Title level={5}>{"Zip Code"}</Title>
      <TextField value={record?.zip_code || "---"} />
      <Title level={5}>{"Country"}</Title>
      <TextField value={record?.country || "---"} />
      <Title level={5}>{"Contact Name"}</Title>
      <TextField value={record?.contact_name || "---"} />
      <Title level={5}>{"Contact Email"}</Title>
      <TextField value={record?.contact_email || "---"} />
      <Title level={5}>{"Contact Phone"}</Title>
      <TextField value={record?.contact_phone || "---"} />
      <Title level={5}>{"Is Recurring"}</Title>
      <TextField value={record?.is_recurring || "---"} />

    </Show>
  );
};

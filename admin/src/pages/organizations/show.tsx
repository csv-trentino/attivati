import { ImageField, NumberField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const OrganizationShow = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <ImageField value={record?.logo} />
      <Title level={5}>{"ID"}</Title>
      <NumberField value={record?.id || "---"} />
      <Title level={5}>{"Name"}</Title>
      <TextField value={record?.name} />
      <Title level={5}>{"Phone"}</Title>
      <TextField value={record?.phone} />
      <Title level={5}>{"Email"}</Title>
      <TextField value={record?.email} />
      <Title level={5}>{"WebSite"}</Title>
      <TextField value={record?.website} />
      <Title level={5}>{"Address"}</Title>
      <TextField value={record?.address} />
      <Title level={5}>{"City"}</Title>
      <TextField value={record?.city} />
      <Title level={5}>{"State"}</Title>
      <TextField value={record?.state} />
      <Title level={5}>{"ZipCode"}</Title>
      <TextField value={record?.zip_code} />
      <Title level={5}>{"Country"}</Title>
      <TextField value={record?.country} />
      <Title level={5}>{"Latitude"}</Title>
      <TextField value={record?.latitude} />
      <Title level={5}>{"Longitude"}</Title>
      <TextField value={record?.longitude} />
      <Title level={5}>{"TaxCode"}</Title>
      <TextField value={record?.tax_code} />
      <Title level={5}>{"VATCode"}</Title>
      <TextField value={record?.vat_code} />
      <Title level={5}>{"Published"}</Title>
      <TextField value={record?.published ? "Yes" : "No"} />
      <Title level={5}>{"ExternalId"}</Title>
      <TextField value={record?.external_id || "---"} />
    </Show>
  );
};

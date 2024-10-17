import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { Input, Space, Table } from "antd";
import { useState } from "react";

export const ExperienceList = () => {
  const [search, setSearch] = useState("");

  const { tableProps } = useTable({
    syncWithLocation: true,
    filters: {
      defaultBehavior: "replace",
      permanent: [{ field: "q", operator: "eq", value: search }],
    },
  });

  return (
    <List>
      <Input
        placeholder={"Search"}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="title" title={"Title"} />
        <Table.Column
          dataIndex="category"
          title={"Category"}
          render={(category) => category?.name}
        />
        <Table.Column dataIndex="city" title={"City"} />
        <Table.Column dataIndex="start_date" title={"Start Date"} />
        <Table.Column dataIndex="end_date" title={"End Date"} />
        <Table.Column
          dataIndex="published"
          title={"Published"}
          render={(published) => (published ? "Yes" : "No")}
        />
        <Table.Column
          dataIndex="organization"
          title={"Organization"}
          render={(organization) => organization?.name}
        />

        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

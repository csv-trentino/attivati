import {
  BooleanField,
  CreateButton,
  DeleteButton,
  EditButton,
  ExportButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord, useGo } from "@refinedev/core";
import { Input, Space, Table } from "antd";
import { getApiEndpoint, getAxiosInstance } from "../../config/network";
import { useState } from "react";

export const UserList = () => {
  const go = useGo();

  const [search, setSearch] = useState("");

  const { tableProps } = useTable({
    syncWithLocation: true,
    filters: {
      defaultBehavior: "replace",
      permanent: [{ field: "q", operator: "eq", value: search }],
    },
  });

  const TrueIcon = () => <span>✅</span>;
  const FalseIcon = () => <span>❌</span>;

  const handleExport = () => {
    const client = getAxiosInstance();

    client
      .get(`${getApiEndpoint()}/user-export`, {
        responseType: "blob",
      })
      .then((res) => {
        const href = URL.createObjectURL(res.data);

        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "users.csv"); 
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .catch((error) => {
        console.error("Error exporting users", error);
      });
  };

  return (
    <List
      headerProps={{
        extra: (
          <Space>
            <ExportButton onClick={handleExport} />
            <CreateButton onClick={() => go({ to: "/users/create" })} />
          </Space>
        ),
      }}
    >
            <Input
        placeholder={"Search"}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="first_name" title={"Name"} />
        <Table.Column dataIndex="last_name" title={"Name"} />
        <Table.Column dataIndex="email" title={"Email"} />
        <Table.Column
          dataIndex="is_superuser"
          title="Superuser"
          render={(value) => (
            <BooleanField
              value={value}
              trueIcon={<TrueIcon />}
              falseIcon={<FalseIcon />}
              valueLabelTrue="Is superuser"
              valueLabelFalse="Is not superuser"
            />
          )}
          width="50%"
        />
        <Table.Column
          dataIndex="accepted_newsletter"
          title="Newsletter"
          render={(value) => (
            <BooleanField
              value={value}
              trueIcon={<TrueIcon />}
              falseIcon={<FalseIcon />}
              valueLabelTrue="subscribed"
              valueLabelFalse="not subscribed"
            />
          )}
          width="50%"
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

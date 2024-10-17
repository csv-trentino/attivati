import {
  BooleanField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";

export const UserList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const TrueIcon = () => <span>✅</span>;
  const FalseIcon = () => <span>❌</span>;

  return (
    <List>
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

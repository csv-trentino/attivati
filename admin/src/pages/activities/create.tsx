import { Create, useForm } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { AutoComplete, Form, Input } from "antd";
import { Select } from "antd/lib";
import { useState } from "react";

export const ActivityCreate = () => {
  const { formProps, saveButtonProps } = useForm({});
  const [searchValue, setSearchValue] = useState("");

  const { data } = useList({
    resource: "experiences",
    filters: [{ field: "q", operator: "eq", value: searchValue }],
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Experience"}
          name={["experience_id"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <AutoComplete
            getRawInputElement={() => {
              return (
                <Input
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                />
              );
            }}
            options={data?.data.map((item) => ({
              label: item.title,
              value: item.id,
            }))}
            onSearch={(value) => {
              setSearchValue(value as unknown as string);
            }}
            onSelect={(value, option) => {
              formProps.form?.setFieldValue("experience_id", value);
              setSearchValue(option.label);
            }}
          />
        </Form.Item>

        <Form.Item
          label={"Status"}
          name={["status"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            style={{ width: "100%" }}
            options={[
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "Rejected", value: "rejected" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label={"Message"}
          name={["message"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label={"Start Date"}
          name={["start_date"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label={"End Date"}
          name={["end_date"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="YYYY-MM-DD"  />
        </Form.Item>

        <Form.Item
          label={"Start Time"}
          name={["start_time"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input placeholder="HH:SS" />
        </Form.Item>

        <Form.Item
          label={"End Time"}
          name={["end_time"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input  placeholder="HH:SS" />
        </Form.Item>
      </Form>
    </Create>
  );
};

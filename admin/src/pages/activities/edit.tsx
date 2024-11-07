import { Edit, useForm } from "@refinedev/antd";
import { useList, useShow } from "@refinedev/core";
import { AutoComplete, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";

export const ActivityEdit = () => {
  const {
    formProps,
    saveButtonProps,
    formLoading,
    form: { setFieldValue },
  } = useForm({});

  const [initialized, setInitialized] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { data } = useList({
    resource: "experiences",
    filters: [{ field: "q", operator: "eq", value: searchValue }],
  });

  const { query: experience } = useShow({
    resource: "experiences",
    id: formProps.initialValues?.experience.id,
  });

  useEffect(() => {
    if (experience.data?.data && !initialized) {
      setSearchValue(experience.data.data.title);
      setFieldValue("experience_id", experience.data.data.id);
      setInitialized(true);
    }
  }, [experience]);

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <Form
        {...{
          ...formProps,
          initialValues: {
            ...formProps.initialValues,
            start_date: formProps.initialValues?.start_date.split("T")[0],
            end_date: formProps.initialValues?.end_date.split("T")[0],
          },
        }}
        layout="vertical"
      >
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
            options={data?.data?.map((item) => ({
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

        <Form.Item label={"Message"} name={["message"]}>
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
          <Input placeholder="YYYY-MM-DD" />
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
          <Input placeholder="HH:MM" />
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
          <Input placeholder="HH:MM" />
        </Form.Item>
      </Form>
    </Edit>
  );
};

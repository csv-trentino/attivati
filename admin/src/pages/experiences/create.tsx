import { Create, ImageField, useForm, useSelect } from "@refinedev/antd";
import { Flex, Form, Input, Switch, Typography } from "antd";
import { Select } from "antd/lib";
import UploadButton from "../../components/UploadButton";
import ImageItem from "../../components/ImageItem";

export const ExperienceCreate = () => {
  const {
    formProps,
    saveButtonProps,
    form: { setFieldValue },
  } = useForm({});

  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: organizationsSelectProps } = useSelect({
    resource: "organizations",
    optionLabel: "name",
    optionValue: "id",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Organization"}
          name={["organization_id"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select style={{ width: "100%" }} {...organizationsSelectProps} />
        </Form.Item>

        <Form.Item
          label={"Title"}
          name={["title"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={"Description"}
          name={["description"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <ImageItem label="Image" name={"image"} setFieldValue={setFieldValue} />

        <Form.Item
          label={"Category"}
          name={["category_id"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select style={{ width: "100%" }} {...categorySelectProps} />
        </Form.Item>

        <Form.Item label={"Latitude"} name={["latitude"]}>
          <Input />
        </Form.Item>

        <Form.Item label={"Longitude"} name={["longitude"]}>
          <Input />
        </Form.Item>

        <Form.Item label={"Address"} name={["address"]}>
          <Input />
        </Form.Item>

        <Form.Item label={"City"} name={["city"]}>
          <Input />
        </Form.Item>

        <Form.Item label={"State"} name={["state"]}>
          <Input />
        </Form.Item>

        <Form.Item label={"Zip Code"} name={["zip_code"]}>
          <Input />
        </Form.Item>

        <Form.Item label={"Country"} name={["country"]}>
          <Input />
        </Form.Item>

        <Form.Item label={"Contact Name"} name={["contact_name"]}>
          <Input />
        </Form.Item>

        <Form.Item label={"Contact Email"} name={["contact_email"]}>
          <Input />
        </Form.Item>

        <Form.Item label={"Contact Phone"} name={["contact_phone"]}>
          <Input />
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
          <Input placeholder="HH:SS" />
        </Form.Item>

        <Form.Item label={"Published"} name={["published"]}>
          <Switch
            defaultChecked={formProps.initialValues?.published}
            onChange={(e) => {
              setFieldValue("published", e);
            }}
          />
        </Form.Item>
      </Form>
    </Create>
  );
};

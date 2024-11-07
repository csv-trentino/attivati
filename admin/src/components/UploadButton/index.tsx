import { ChangeEvent, FC, useRef, useState } from "react";
import { getApiEndpoint, getAxiosInstance } from "../../config/network";
import { useNotification } from "@refinedev/core";
import { Button } from "antd";

interface Props {
  onUpload: (url: string) => void;
}

const UploadButton: FC<Props> = ({ onUpload }) => {
  const ref = useRef<HTMLInputElement>(null);
  const { open } = useNotification();
  const axios = getAxiosInstance();
  const apiEndpoint = getApiEndpoint();

  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${apiEndpoint}/media`, formData);
      open?.({
        message: "Upload success",
        type: "success",
      });
      onUpload(response.data.Url);
    } catch (error) {
      console.error(error);
      open?.({
        message: "Upload failed",
        type: "error",
      });
    }

    setLoading(false);
  };

  return (
    <>
      <Button onClick={() => ref?.current?.click()} loading={loading}>Upload</Button>
      <input
        type="file"
        onChange={handleUpload}
        style={{ display: "none" }}
        ref={ref}
      />
    </>
  );
};

export default UploadButton;

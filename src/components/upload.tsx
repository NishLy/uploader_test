import React from "react";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";

export default function Upload() {
  return (
    <>
      <form action="">
        <span className="p-float-label">
          <InputText id="username" />
          <label htmlFor="username">Username</label>
        </span>

        <FileUpload
          name="demo[]"
          url={"/api/upload"}
          accept="image/*"
          contentStyle={{ minWidth: "100%", }}
          style={{ minWidth: "80vw", minHeight: "100%", padding: 0 }}
          maxFileSize={1000000}
          emptyTemplate={
            <div className="m-0">Drag and drop files to here to upload.</div>
          }
        />
      </form>
    </>
  );
}

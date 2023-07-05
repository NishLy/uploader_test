import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Fieldset } from "primereact/fieldset";
import { Sidebar } from "primereact/sidebar";
import { ScrollTop } from "primereact/scrolltop";
import { TabView, TabPanel } from "primereact/tabview";
import Upload from "./components/upload";
import Table from "./components/table";

//theme

export default function RemovableSortDemo() {
  const [visibleLeft, setVisibleLeft] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "100vw",
        paddingTop: "5vh",
        paddingBottom: "5vh",
        paddingLeft: "5vw",
        paddingRight: "5vw",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <Fieldset legend="Header" style={{ minHeight: "100%" }}>
        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        
        >
          <TabPanel header="Upload File" style={{ padding: 0 }}>
            <Upload />
          </TabPanel>
          <TabPanel header="List Upload" style={{ padding: 0 }}>
            <Table
              data={[
                {
                  filename: "2431",
                  name: "asddsa",
                  type: "b",
                  upload_time: 21421,
                },
              ]}
            />
          </TabPanel>
        </TabView>

        <ScrollTop
          target="parent"
          threshold={100}
          style={{
            position: "fixed",
            bottom: "5vh",
            right: "5vw",
            backgroundColor: "blue",
          }}
          icon="pi pi-arrow-up text-base"
        />
      </Fieldset>
    </main>
  );
}

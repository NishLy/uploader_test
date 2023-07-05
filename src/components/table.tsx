import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Fieldset } from 'primereact/fieldset';
import * as React from 'react';

export interface IAppProps {
data:Data["upload"][]
}

export default function Table (props: IAppProps) {
  return (
   
    <DataTable
      value={props.data}
      removableSort
      tableStyle={{ width: "100%", maxWidth: "90vw" }}
    >
      <Column
        field="code"
        header="Code"
        sortable
        style={{ width: "25%" }}
      ></Column>
      <Column
        field="name"
        header="Name"
        sortable
        style={{ width: "25%" }}
      ></Column>
      <Column
        field="category"
        header="Category"
        sortable
        style={{ width: "25%" }}
      ></Column>
      <Column
        field="quantity"
        header="Quantity"
        sortable
        style={{ width: "25%" }}
      ></Column>
    </DataTable>

  );
}

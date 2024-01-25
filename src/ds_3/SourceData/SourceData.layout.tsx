import React, { ChangeEvent, useCallback } from "react";
import { Field, FieldProps, useFormikContext } from "formik";

import {
  FainfoAll,
  FainfoAllData,
  SourceDataLayoutProps,
} from "./sourceData.interface";
import { Th } from "./children/th/Th";
import { Td } from "./children/td/Td";
import { CustomNumberInput } from "./children/CustomNumberInput/CustomNumberInput";

import "./styles.scss";

export const SourceDataLayout = ({
  columns,
  rows,
  addChangedData,
}: SourceDataLayoutProps) => {
  const formApi = useFormikContext<FainfoAll[]>();

  const onChangeItem = useCallback(
    (e: ChangeEvent<any>, rowIndex: number, columnIndex: number) => {
      formApi.setFieldValue(
        `rows[${rowIndex}]data.${columnIndex}.fa_data`,
        e.target?.value
      );
      // По такому ключу будем определять, какая ячейка изменилась.
      // Нужно в extractUpdateData
      addChangedData(`${rowIndex}-${columnIndex}`);
    },
    [addChangedData]
  );

  return (
    <>
      <button
        type="submit"
        style={{ marginBottom: "10px" }}
        onClick={formApi.submitForm}
      >
        Сохранить
      </button>
      <table>
        <thead>
          <tr>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            <Th>Структурное подразделение</Th>
            {columns.map((column) => (
              <Th key={column.pred_id}>
                <div className="source-data__th-text" title={column.sname}>
                  {column.sname}
                </div>
              </Th>
            ))}
          </tr>
          <tr>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            {columns.map((column) => (
              <Th key={column.pred_id}>
                <div className="source-data__th-text" title={column.vname}>
                  {column.vname}
                </div>
              </Th>
            ))}
          </tr>
          <tr>
            <Th>Группа исходных данных</Th>
            <Th>Код исходных данных</Th>
            <Th>ИД исходных данных</Th>
            <Th>Исходная система</Th>
            {columns.map((column) => (
              <Th key={column.pred_id}>Значение исх.данных</Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            return (
              <tr key={row.info_id}>
                <Td>{row.grtitle}</Td>
                <Td>{row.info_id}</Td>
                <Td>{row.ititle}</Td>
                <Td>{row.fasyst}</Td>
                {row.data.map((item, columnIndex) => (
                  <Td key={item.pred_id} disabled={item.disabled}>
                    <Field
                      name={`rows[${rowIndex}]data.${columnIndex}.fa_data`}
                    >
                      {(fieldApi: FieldProps<number>) => (
                        <CustomNumberInput
                          name={fieldApi.field.name}
                          onChange={(e) =>
                            onChangeItem(e, rowIndex, columnIndex)
                          }
                          value={fieldApi.field.value}
                          disabled={item.disabled}
                        />
                      )}
                    </Field>
                  </Td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

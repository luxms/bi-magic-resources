import React, { ChangeEvent, useCallback, useEffect } from "react";
import { Field, FieldProps, useFormikContext } from "formik";

import { UrlState } from "bi-internal/core";

import { FainfoAll, SourceDataLayoutProps } from "./sourceData.interface";
import { Th } from "./children/th/Th";
import { Td } from "./children/td/Td";
import { CustomNumberInput } from "./children/CustomNumberInput/CustomNumberInput";

import "./styles.scss";

export const SourceDataLayout = ({
  columns,
  rows,
  addChangedData,
  isEditing,
  setIsEditing,
  setIsReload,
  lock,
  unlock,
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

  const onClickEdit = useCallback(() => {
    const url = UrlState.getInstance().getModel();
    if (!isEditing) {
      lock(url);
      setIsReload(true);
    } else {
      unlock(url);
    }
  }, [isEditing, setIsEditing, setIsReload]);

  return (
    <>
      <button
        type="submit"
        style={{ marginBottom: "10px" }}
        onClick={formApi.submitForm}
        disabled={!isEditing}
      >
        Сохранить
      </button>
      <button
        style={{ marginBottom: "10px", marginLeft: "10px" }}
        onClick={() => {
          // Отправка запроса на проверку блокировки
          onClickEdit();
        }}
      >
        {!isEditing ? "Открыть редактирование" : "Закрыть редактирование"}
      </button>
      <div style={{ overflow: "scroll", height: "97%", width: "100%" }}>
        <table>
          <thead className="source-data-th-custom__head">
            <tr>
              <Th className="source-data-td-custom__head source-data-td-custom__first"></Th>
              <Th className="source-data-td-custom__head source-data-td-custom__second"></Th>
              <Th className="source-data-td-custom__head source-data-td-custom__third"></Th>
              <Th className="source-data-td-custom__head source-data-td-custom__fourth">
                Структурное подразделение
              </Th>
              {columns.map((column) => (
                <Th key={column.pred_id}>
                  <div className="source-data__th-text" title={column.sname}>
                    {column.sname}
                  </div>
                </Th>
              ))}
            </tr>
            <tr>
              <Th className="source-data-td-custom__head source-data-td-custom__first"></Th>
              <Th className="source-data-td-custom__head source-data-td-custom__second"></Th>
              <Th className="source-data-td-custom__head source-data-td-custom__third"></Th>
              <Th className="source-data-td-custom__head source-data-td-custom__fourth"></Th>
              {columns.map((column) => (
                <Th key={column.pred_id}>
                  <div className="source-data__th-text" title={column.vname}>
                    {column.vname}
                  </div>
                </Th>
              ))}
            </tr>
            <tr>
              <Th className="source-data-td-custom__head source-data-td-custom__first">
                Группа исходных данных
              </Th>
              <Th className="source-data-td-custom__head source-data-td-custom__second">
                Код исходных данных
              </Th>
              <Th className="source-data-td-custom__head source-data-td-custom__third">
                ИД исходных данных
              </Th>
              <Th className="source-data-td-custom__head source-data-td-custom__fourth">
                Исходная система
              </Th>
              {columns.map((column) => (
                <Th key={column.pred_id}>Значение исх.данных</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              return (
                <tr key={row.info_id}>
                  <Td className="source-data-td-custom__head source-data-td-custom__first">
                    {row.grtitle}
                  </Td>
                  <Td className="source-data-td-custom__head source-data-td-custom__second">
                    {row.info_id}
                  </Td>
                  <Td className="source-data-td-custom__head source-data-td-custom__third">
                    {row.ititle}
                  </Td>
                  <Td className="source-data-td-custom__head source-data-td-custom__fourth">
                    {row.fasyst}
                  </Td>
                  {row.data.map((item, columnIndex) => (
                    <Td
                      key={item.pred_id}
                      disabled={item.disabled || !isEditing}
                    >
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
                            disabled={item.disabled || !isEditing}
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
      </div>
    </>
  );
};

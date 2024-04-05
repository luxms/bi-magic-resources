import React, { ChangeEvent, useCallback } from "react";
import { Field, FieldProps, useFormikContext } from "formik";

import { SharesInfluenceLayoutProps } from "./sharesInfluence.interface";
import { Th, Td, CustomNumberInput } from "./children";

import "./styles.scss";

export const SharesInfluenceLayout = ({
  columns,
  rows,
  addChangedData,
  isEditing,
  setIsEditing,
  setIsReload,
  lock,
  unlock,
  tcaption,
}: SharesInfluenceLayoutProps) => {
  const formApi = useFormikContext();

  const onChangeItem = useCallback(
    (e: ChangeEvent<any>, rowIndex: number, columnIndex: number) => {
      formApi.setFieldValue(
        `rows[${rowIndex}].data[${columnIndex}].fashare`,
        e.target?.value
      );
      // По такому ключу будем определять, какая ячейка изменилась.
      // Нужно в extractUpdateData
      addChangedData(`${rowIndex}-${columnIndex}`);
    },
    [addChangedData]
  );

  const onClickEdit = useCallback(() => {
    if (!isEditing) {
      lock();
      setIsReload(true);
    } else {
      unlock();
    }
  }, [isEditing, setIsEditing, setIsReload]);

  return (
    <>
      <div style={{ padding: "10px" }}>{tcaption}</div>
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
      <table style={{ height: "100%", width: "100%" }}>
        <thead>
          <tr>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            {columns.map((column, index) => (
              <Th key={column.obj_text || index} colspan={column.colspan}>
                <div
                  className="shares-influence__th-text"
                  title={column.obj_text}
                >
                  {column.obj_text}
                </div>
              </Th>
            ))}
          </tr>
          <tr>
            <Th></Th>
            <Th></Th>
            <Th></Th>
            {columns.map((column, index) =>
              column.data.map((item) => (
                <Th key={item.f_group_text || index} colspan={item.colspan}>
                  <div
                    className="shares-influence__th-text"
                    title={item.f_group_text}
                  >
                    {item.f_group_text}
                  </div>
                </Th>
              ))
            )}
          </tr>

          <tr>
            <Th rowspan={3}>Группа рисков</Th>
            <Th rowspan={3}>№ п/п</Th>
            <Th></Th>
            {columns.map((column, index) =>
              column.data.map((item) =>
                item.data.map((item) => (
                  <Th key={item.f_text || index}>
                    <div
                      className="shares-influence__th-text"
                      title={item.f_text}
                    >
                      {item.f_text}
                    </div>
                  </Th>
                ))
              )
            )}
          </tr>
        </thead>
        <tbody style={{ height: "100%", width: "100%" }}>
          {rows.map((row, rowIndex) => {
            return (
              <tr key={row.r_text} style={{ height: "100%", width: "100%" }}>
                <Td>{row.r_group_text ?? ""}</Td>
                <Td>{rowIndex + 1}</Td>
                <Td>{row.r_text}</Td>
                {row.data.map((item, columnIndex) => (
                  <Td key={item.r_text} disabled={!isEditing}>
                    <Field
                      name={`rows[${rowIndex}].data[${columnIndex}].fashare`}
                    >
                      {(fieldApi: FieldProps<number>) => (
                        <CustomNumberInput
                          name={fieldApi.field.name}
                          onChange={(e) =>
                            onChangeItem(e, rowIndex, columnIndex)
                          }
                          value={fieldApi.field.value}
                          disabled={!isEditing}
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

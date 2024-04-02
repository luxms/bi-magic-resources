import React, { ChangeEvent, useCallback } from "react";
import { Field, FieldProps, useFormikContext } from "formik";

import { SharesInfluenceLayoutProps } from "./AssessmentIntervals.interface";
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
}: SharesInfluenceLayoutProps) => {
  const formApi = useFormikContext();

  const onChangeItemMin = useCallback(
    (e: ChangeEvent<any>, rowIndex: number, columnIndex: number) => {
      formApi.setFieldValue(
        `rows[${rowIndex}].data[${columnIndex}].min_border`,
        e.target?.value
      );
      // По такому ключу будем определять, какая ячейка изменилась.
      // Нужно в extractUpdateData
      addChangedData(`${rowIndex}-${columnIndex}`);
    },
    [addChangedData]
  );
  const onChangeItemMax = useCallback(
    (e: ChangeEvent<any>, rowIndex: number, columnIndex: number) => {
      formApi.setFieldValue(
        `rows[${rowIndex}].data[${columnIndex}].max_border`,
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
      <table>
        <thead>
          <tr>
            <Th></Th>
            <Th>ИД оценки степени проявления фактора</Th>
            {columns.map((column) => (
              <Th key={column.faidval}>
                <div
                  className="assessment-intervals__th-text"
                  title={"" + column.faidval}
                >
                  {column.faidval}
                </div>
              </Th>
            ))}
          </tr>
          <tr>
            <Th>Группа факторов</Th>
            <Th>ИД фактора</Th>
            {columns.map((column) => (
              <Th key={column.faidval}>
                Минимальная граница/Максимальная граница
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            return (
              <tr key={row.f_text}>
                <Td>{row.f_group_text ?? ""}</Td>
                <Td>{row.f_text}</Td>
                {row.data.map((item, columnIndex) => (
                  <Td key={item.f_text} disabled={item.disabled || !isEditing}>
                    <>
                      <Field
                        name={`rows[${rowIndex}].data[${columnIndex}].min_border`}
                      >
                        {(fieldApi: FieldProps<number>) => (
                          <CustomNumberInput
                            name={fieldApi.field.name}
                            onChange={(e) =>
                              onChangeItemMin(e, rowIndex, columnIndex)
                            }
                            value={fieldApi.field.value}
                            disabled={item.disabled || !isEditing}
                          />
                        )}
                      </Field>
                      <Field
                        name={`rows[${rowIndex}].data[${columnIndex}].max_border`}
                      >
                        {(fieldApi: FieldProps<number>) => (
                          <CustomNumberInput
                            name={fieldApi.field.name}
                            onChange={(e) =>
                              onChangeItemMax(e, rowIndex, columnIndex)
                            }
                            value={fieldApi.field.value}
                            disabled={item.disabled || !isEditing}
                          />
                        )}
                      </Field>
                    </>
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

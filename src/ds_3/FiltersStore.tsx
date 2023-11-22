import React, { useMemo, useEffect, useState } from "react";

import {KoobFiltersService} from "bi-internal/services";
import {AuthenticationService, repo} from "bi-internal/core";

const EMPTY_FILTERS_STR = "{}";

const getEndpoint = (): string => "/api/db/public.users_filter";

const getUrlFilterChunk = (props: {userName: string, schemaName: string, dashboardId: number}) => {
    const {userName, schemaName, dashboardId} = props;
    return `/.filter(user_name='${userName}' && schema_name='${schemaName}' && dashboard_id = ${dashboardId})`
}


/**
 * Загружаем ранее сохранненную строку фильтров с сервера.
 */
const getFiltersString = async (userName: string, schemaName: string, dashboardId: number): Promise<string> => {
    try {
        const response = await fetch(`${getEndpoint()}${getUrlFilterChunk({userName, dashboardId, schemaName})}`);
        // Возвращается массив записей из созданной нами таблицы.
        // Если вернулось 0 или более одного элемента то мы возвращем строку соответствующую пустым фильтрам.
        // Это упрощенная реализация, не предполагающая очисти ошибчно созданных дублирующих записей.
        const records: {filter_str: string}[] = await response.json();
        if (records.length !== 1) {
            return EMPTY_FILTERS_STR;
        }
        return records[0].filter_str;
    } catch (error) {
        console.log(error);
    }
    return EMPTY_FILTERS_STR;
};

/**
 * Сохраняем строку фильтров на сервер.
 */
const saveFiltersString = async (userName: string, schemaName: string, dashboardId: number, filterString: string): Promise<void> => {
    // Пробуем обновить запись с заданными user_name, schema_name и dashboard_id
    const updateData = {filter_str: filterString};
    try {
        const response = await fetch(
            `${getEndpoint()}${getUrlFilterChunk({userName, dashboardId, schemaName})}`,
            {
                method: "PUT",
                credentials: "same-origin",
                headers: {"Content-type": "application/json; charset=utf-8"},
                body: JSON.stringify(updateData),
            }
        );
        // если с заданными параметрами не существует мы создаем новую.
        if (response.status === 404) {
            const insertData = {
                user_name: userName,
                dashboard_id: Number(dashboardId),
                schema_name: schemaName,
                filter_str: filterString,
            };
            try {
                const response = await fetch(
                    getEndpoint(),
                    {
                        method: "POST",
                        credentials: "same-origin",
                        body: JSON.stringify(insertData),
                        headers: {"Content-type": "application/json; charset=utf-8"},
                    }
                );
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.log(error);
    }
};

const FiltersStore = (props) => {
    // конфиг передаваемый нашей компоненте системой
    const {cfg} = props;
    // текущее строковое представление фильтров
    const [currentFiltersStr, setCurrentFiltersStr] = useState(EMPTY_FILTERS_STR);
    // строковое представление фильтров загруженное с сервера
    const [savedFilterStr, setSavedFiltersStr] = useState(EMPTY_FILTERS_STR);
    // отличаются ли текущие фильтры от сохраненных на сервере
    const isFiltersModified = savedFilterStr !== currentFiltersStr;
    // пустые ли текущие фильтры
    const isFiltersEmpty = currentFiltersStr === EMPTY_FILTERS_STR;
    // получаем служебные объекты, которые будем использовать в дальнейшем.
    const {koobFiltersService, authenticationService} = useMemo(() => {
        const koobFiltersService = KoobFiltersService.getInstance();
        const authenticationService = AuthenticationService.getInstance();
        return {koobFiltersService, authenticationService};
    }, []);
    // callback для события изменения фильтров
    const handleFiltersUpdated = () => {
        if (!koobFiltersService) {
            return; 
        }

        const koobFilterModel = koobFiltersService.getModel();

        if (koobFilterModel.loading || koobFilterModel.error) {
            return;
        }
        // обновляем текущее строковое предсталение фильтров 
        setCurrentFiltersStr(JSON.stringify(koobFilterModel.filters));
    };

    // подписываемся на события изменения фильтров
    useEffect(() => {
        if (!koobFiltersService) {
            return; 
        }
        koobFiltersService.subscribeUpdatesAndNotify(handleFiltersUpdated);
    }, [koobFiltersService]);

    // скачиваем сохраненные ранее фильтры с сервера
    useEffect(() => {
        if (!authenticationService) {
            return;
        }

        const username = authenticationService.getModel().username;
        if (username === undefined) {
            return;
        }

        const doWork = async () => {
            const fetchedFiltersStr = await getFiltersString(
                username,
                cfg.dataset.schemaName,
                Number(cfg.dashId)
            );
            setSavedFiltersStr(fetchedFiltersStr);
        };

        doWork().finally();

    }, [authenticationService, cfg]);

    // обработчик клика по кнопке сохранения фильтров
    const handleSaveFilters = async () => {
        if (!authenticationService) {
            return;
        }

        const username = authenticationService.getModel().username;
        if (username === undefined) {
            return;
        }
        // загружаем текущее строкое представление фильтров на сервер
        await saveFiltersString(
            username,
            cfg.dataset.schemaName,
            Number(cfg.dashId),
            currentFiltersStr,
        );
        // обновляем строковое представление фильтров загруженное с сервера
        setSavedFiltersStr(currentFiltersStr);
    };

    // обработчик клика по кнопке применения ранее сохраненных фильтров
    const handleLoadFilters = () => {
        if (!koobFiltersService || !cfg.dataSource.koob) {
            return; 
        }
        
        if (!savedFilterStr) {
            return;
        }
        // парсим строкое представление в объект и применяем его
        koobFiltersService.setFilters(cfg.dataSource.koob, JSON.parse(savedFilterStr));
    };

    // обработчик клика по кнопке очистки фильтров
    const handleClearFilters = () => {
        if (!koobFiltersService || !cfg.dataSource.koob) {
            return; 
        }

        const koobFilterModel = koobFiltersService.getModel();

        if (koobFilterModel.loading || koobFilterModel.error) {
            return;
        }
        // берем текущие фильтры и всем ключам задаем значение undefined
        const newFilters = Object.keys(koobFilterModel.filters).reduce((accumulator, current) => {
            accumulator[current] = undefined;
            return accumulator;
        }, {});
        // применяем получишийся объект
        koobFiltersService.setFilters(cfg.dataSource.koob, newFilters);
    };

    return (
        <div style={{padding: "20px"}}>
            <button disabled={!isFiltersModified} onClick={handleSaveFilters}>Сохранить фильтр</button><br /><br />
            <button disabled={!isFiltersModified} onClick={handleLoadFilters}>Загрузить фильтр</button><br /><br />
            <button disabled={isFiltersEmpty} onClick={handleClearFilters}>Очистить фильтр</button><br /><br />
        </div>
    );
};

export default FiltersStore;
import React, { PropsWithChildren } from 'react';

type IfICanSelect = {
    eachOf?: string[];
    oneOf?: string[];
    one?: string;
    oneValue?: any;
} & ({ eachOf: string[] } | { oneOf: string[] } | { one: string; oneValue?: any });

type IfICanProps = Readonly<PropsWithChildren<IfICanSelect>>;

/**
 * @test Написаны тесты.
 *
 * @description Компонент для условного рендеринга на основе прав доступа.
 * Проверяет наличие указанных прав через CanIService.
 */
export declare class IfICan extends React.Component<IfICanProps> {}

/**
 * @test Написаны тесты
 *
 * @description Обертка для компонента, проверяет adm.config [common.features]: alpha
 */
export declare const IfAlpha: ({ children }: { children: any }) => any;

/**
 * @test Написаны тесты
 *
 * @description Обертка для компонента, проверяет adm.config [common.features]: beta
 */
export declare const IfBeta: ({ children }: { children: any }) => any;

/**
 * @description Обертка для компонента, проверяет settings.js features.
 */
export declare const IfSettingsFeatures: ({ children, feature }: {
    children: any;
    feature: string;
}) => any;

/**
 * @test Написаны тесты
 *
 * Собирает и возвращает уникальный массив всех переданных claims.
 */
export declare function getAllClaims({ eachOf, oneOf, one }: {
    eachOf?: string[];
    oneOf?: string[];
    one?: string;
}): any[];

export default IfICan;

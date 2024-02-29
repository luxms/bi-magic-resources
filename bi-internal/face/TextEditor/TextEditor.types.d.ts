export interface ITextEditorProps {
    className?: string;
    content: string;
    contentType: 'application/json' | 'image/x-svg' | 'image/svg+xml' | 'text/html' | 'application/javascript' | 'application/x-javascript' | 'text/javascript' | 'text/x-javascript' | 'application/sql' | 'application/x-sql' | 'text/sql' | 'text/x-sql' | 'application/xml' | 'text/markdown' | 'text';
    readOnly?: boolean;
    onChange: (content: string) => void;
    onPressSave?: (content: string) => void;
    theme?: any;
}
